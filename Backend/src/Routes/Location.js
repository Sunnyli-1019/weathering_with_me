// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
/* ============================
Imports
===============================*/
// Import modules
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
// Import models
const Location = require("../Models/Location");
const Weather = require("../Models/Weather");
const User = require("../Models/User");
// Import helpers
const refreshWeatherData = require("../Helpers/refreshWeatherData");
const verifyToken = require("../Helpers/verifyToken");
const checkIfAdmin = require("../Helpers/checkIfAdmin");

/* ============================
Configuration
===============================*/
router.use(verifyToken);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// Swagger components definition
/**
 * @swagger
 * components:
 *   schemas:
 *    Weather:
 *      type: object
 *      properties:  
 *        lastUpdate: 
 *          type: string
 *        temp_c:
 *          type: number
 *        wind_kph:
 *          type: number
 *        wind_dir:
 *          type: string
 *        humidity:
 *          type: number
 *        precip_mm:
 *          type: number
 *        vis_km: 
 *          type: number 
 *    Comment:
 *      type: object
 *      properties:
 *        author:
 *          type: string
 *        text:
 *          type: string
 *    Location:
 *       type: object
 *       properties:
 *         name:
 *          type: string
 *         country:
 *          type: string
 *         lat:
 *          type: number
 *         lang:
 *          type: number 
 *         comments:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Comment' 
 *         weather:
 *          $ref: '#/components/schemas/Weather'
 *         isFavourite: 
 *          type: boolean
 */

// Swagger tag definition
/**
 * @swagger
 * tags:
 *  name: Location
 */

/* ============================
Routes
===============================*/
/**
 * @swagger
 * /location:
 *  get:
 *    description: Get all locations without comments and weather information
 *    tags: [Location]
 *    parameters: 
 *      - in: query
 *        name: filter
 *        required: false
 *        schema:
 *          type: string
 *        description: keyword(field), e.g., ?filter=kong(name)
 *      - in: query
 *        name: sort_by
 *        required: false
 *        schema:
 *          type: string
 *        description: order(field), e.g., sort_by=asc(name)
 *      - in: query
 *        name: refresh
 *        required: false
 *        schema:
 *          type: string
 *        description: true/false - true if data should be refreshed from weather API, false otherwise
 *      - in: query
 *        name: favourites
 *        required: false
 *        schema: 
 *          type: string
 *        description: true/false - true if only users favourite locations are requested, false otherwise
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Returns a list of all locations
 *        content:
 *          application/json:
 *            schema:           
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Location'
 *      404:
 *        description: An error occured
 */
router.get("/", async (req, res) => {
  // Refresh weather data if respective parameter is set to true
  if (req.query.refresh == "true") {
    const refreshStatus = await refreshWeatherData();
    if (!refreshStatus) res.status(404).json({message: "Error updating weather"});
  }
  // Filter variable
  let filter = {};
  // check if only users favourites are supposed to be returned
  if (req.query.favourites == "true") {
    const favLocs = (await User.findById(req.userId)).favouriteLocs;
    filter["_id"] = { $in: favLocs };
  }
  // If keyword filter is applied, only locations that contain the keyword in respective field are returned
  if (req.query.filter) {
    let [keyword, searchField] = req.query.filter.split("(");
    searchField = searchField.replace(")", "");
    filter[searchField] = { $regex: keyword, $options: "i" };
  }
  // Add find part to query
  let query = Location.find(filter).select("-comments -__v").lean();
  // If result is supposed to be sorted, the query is adapted respectively
  if (req.query["sort_by"]) {
    let [order, orderField] = req.query["sort_by"].split("(");
    orderField = orderField.replace(")", "");
    query = query.sort({ [orderField]: [order] });
  }
  // Execute query and return results
  let locs = await query.exec();
  // Add weather information to each location
  const promise = locs.map(async (loc) => {
    const query2 = Weather.findOne({ location: loc._id }).select(
      "-_id -__v -location"
    );
    const weather = await query2.exec();
    loc.weather = weather;
    // Check if location is user favourite
    const user = await User.findById(req.userId);
    loc.isFavourite = user.favouriteLocs.includes(loc._id) ? true : false;
    delete loc._id;
    return loc;
  });
  const result = await Promise.all(promise);
  res.status(200).json(result);
});

/**
 * @swagger
 * /location:
 *  post:
 *    description: Add a new location to the database
 *    tags: [Location]
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              lat:
 *                type: number
 *              long:
 *                type: number
 *              cityName: 
 *                type: string
 *              country: 
 *                type: string         
 *    responses:
 *      200:
 *        description: Location successully created. Newly created location object is returned
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Location'
 *      404:
 *        description: Creation of Location unsuccessful because not all required information was provided
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error on the server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string       
 */
router.post("/", express.json(), checkIfAdmin, (req, res) => {
  const lat = req.body.lat;
  const long = req.body.long;
  const cityName = req.body.cityName;
  const country = req.body.country;
  if (lat && long && cityName && country) {
    const newLoc = new Location({
      name: cityName,
      country: country,
      lat: lat,
      long: long,
    });
    newLoc.save((err, loc) => {
      if (err) res.status("500").json({ message: "Error on the server" });
      else res.redirect("/location");
    });
  } else
    res
      .status("404")
      .json({
        message: "Creation of Location unsuccessful because not all required information was provided",
      });
});

/**
 * @swagger
 * /location/{city}:
 *  get:
 *    description: Returns the location object that corresponds to the city name
 *    tags: [Location]
 *    parameters:
 *      - in: path
 *        name: city
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of the city
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: refresh
 *        required: false
 *        schema:
 *          type: string
 *        description: true/false - true if data should be refreshed from weather API, false otherwise
 *    responses:
 *      200:
 *        description: Location object that corresponds to city name successully returned
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Location'
 *      404:
 *        description: Location not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error on the server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string       
 */
router.get("/:city", async (req, res) => {
  // Refresh weather data if respective parameter is set to true
  if (req.query.refresh == "true") {
    const refreshStatus = await refreshWeatherData();
    if (!refreshStatus) res.status(404).json({message: "Error updating weather"});
  }
  // Obtain location information of specified city
  let query = Location.findOne({ name: req.params.city }).select("-__v").lean();
  query.exec((err, loc) => {
    if (err) res.status(500).json({ message: "Error on the server" });
    if (!loc) res.status(404).json({ message: "Location not found" });
    // Obtain weather information related to the location
    const query2 = Weather.findOne({ location: loc._id }).select(
      "-_id -__v -location"
    );
    query2.exec(async (err, weather) => {
      if (err) res.status(500).json({ message: "Error on the server" });
      if (!weather)
        res.status(404).json({ message: "Weather information not found" });
      loc.weather = weather;
      // Check if location is user favourite
      const user = await User.findById(req.userId);
      loc.isFavourite = user.favouriteLocs.includes(loc._id) ? true : false;
      delete loc._id;
      res.status(200).json(loc);
    });
  });
});

/**
 * @swagger
 * /location/{city}:
 *  put:
 *    description: Update existing location in the database
 *    tags: [Location]
 *    parameters:
 *      - in: path
 *        name: city
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of the city
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              lat:
 *                type: number
 *              long:
 *                type: number
 *              cityName: 
 *                type: string
 *              country: 
 *                type: string
 *    responses:
 *        200:
 *          description: Location successully updated. Updated location object is returned
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Location'
 *        404:
 *          description: Update of Location unsuccessful because not all required information was provided
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        500:
 *          description: Error on the server
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 */
router.put("/:city", express.json(), checkIfAdmin, (req, res) => {
  let update = {};
  if (req.body.cityName) update.name = req.body.cityName;
  if (req.body.country) update.country = req.body.country;
  if (req.body.lat) update.lat = req.body.lat;
  if (req.body.long) update.long = req.body.long;
  const query = Location.findOneAndUpdate({ name: req.params.city }, update, {
    new: true,
  }).select("-_id -__v");
  query.exec((err, loc) => {
    if (err) res.status(500).json({ message: "Error on the server" });
    if (!loc) res.status(404).json({ message: "Location not found" });
    //res.status(200).redirect(`/location/${loc.name}`);
    res.status(200).json({ message: "Location Updated" });
  });
});

/**
 * @swagger
 * /location/{city}:
 *  delete:
 *    description: Delete location from the database
 *    tags: [Location]
 *    parameters:
 *      - in: path
 *        name: city
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of the city
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *        200:
 *          description: Location successully deleted. Updated set of location objects is returned
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Location'
 *        404:
 *          description: Deletion of Location unsuccessful because Location was not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        500:
 *          description: Error on the server
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 */
router.delete("/:city", express.json(), checkIfAdmin, (req, res) => {
  Location.findOneAndDelete({ name: req.params.city }, (err, loc) => {
    if (err) res.status(500).json({ message: "Error on the server" });
    if (!loc) res.status(404).json({ message: "Deletion of Location because Location was not found" });
    //res.status(200).redirect("/location");
    res.status(200).json({ message: "Location Deleted" });
  });
});

/**
 * @swagger
 * /location/{city}/weather:
 *  get:
 *    description: Get the weather information for one specific location
 *    tags: [Location]
 *    parameters:
 *      - in: path
 *        name: city
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of the city
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: refresh
 *        required: false
 *        schema:
 *          type: string
 *        description: true/false - true if data should be refreshed from weather API, false otherwise
 *    responses:
 *      200: 
 *        description: Weather object corresponding to one specific location
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Weather'
 *      404:
 *        description: Location or weather information not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error on the server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string       
 */
router.get("/:city/weather", async (req, res) => {
  // Refresh weather data if respective parameter is set to true
  if (req.query.refresh == "true") {
    const refreshStatus = await refreshWeatherData();
    if (!refreshStatus) res.status(404).json({message: "Error updating weather"});
  }
  // Obtain location information of specified city
  let query = Location.findOne({ name: req.params.city }).select("_id");
  query.exec((err, loc) => {
    if (err) res.status(500).json({ message: "Error on the server" });
    if (!loc) res.status(404).json({ message: "Location not found" });
    // Obtain weather information related to the location
    const query2 = Weather.findOne({ location: loc._id }).select(
      "-_id -__v -location"
    );
    query2.exec((err, weather) => {
      if (err) res.status(500).json({ message: "Error on the server" });
      if (!weather)
        res.status(404).json({ message: "Weather information not found" });
      res.status(200).json(weather);
    });
  });
});

/**
 * @swagger
 * /location/{city}/comments:
 *  get:
 *    description: Return all comments corresponding to one specific location
 *    tags: [Location]
 *    parameters:
 *      - in: path
 *        name: city
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of the city
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200: 
 *        description: All comments corresponding to one specific location
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Comment'
 *      404:
 *        description: Location or weather information not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error on the server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string       
 */
router.get("/:city/comments", async (req, res) => {
  // Obtain location information of specified city
  let query = Location.findOne({ name: req.params.city }).select("comments");
  query.exec((err, loc) => {
    if (err) res.status(500).json({ message: "Error on the server" });
    if (!loc) res.status(404).json({ message: "Location not found" });
    res.status(200).json(loc.comments);
  });
});

/**
 * @swagger
 * /location/{city}/comments:
 *  post:
 *    description: Add comment to the list of comments that is associated with one specific location
 *    tags: [Location]
 *    parameters:
 *      - in: path
 *        name: city
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of the city
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *    responses:
 *      200: 
 *        description: Updated list of comments corresponding to one specific location
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Comment'
 *      404:
 *        description: Location not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error on the server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string       
 */
router.post("/:city/comments", express.json(), async (req, res) => {
  const userQuery = User.findById(req.userId).select("username");
  userQuery.exec((err, user) => {
    if (err) res.status(500).json({ message: "Error on the server" });
    if (!user) res.status(404).json({ message: "User not found" });
    Location.findOne({ name: req.params.city }, async (err, loc) => {
      if (err) res.status(500).json({ message: "Error on the server" });
      if (!loc) res.status(404).json({ message: "Location not found" });
      loc.comments.push({ author: user.username, text: req.body.text });
      await loc.save();
      res.status(200).json(loc.comments);
    });
  });
});

/**
 * @swagger
 * /location/{city}/favourite:
 *  put:
 *    description: Add this city to user’s favourite list of locations
 *    tags: [Location]
 *    parameters:
 *      - in: path
 *        name: city
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of the city
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successfully added location to favourites. Returns the updated list of user's favourite locations
 *        content:
 *          application/json:
 *            schema:           
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Location'
 *      404:
 *        description: Location or user not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error on the server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 */
router.put("/:city/favourite", (req, res) => {
  User.findById(req.userId, (err, user) => {
    if (err) res.status(500).json({ message: "Error on the server" });
    if (!user) res.status(404).json({ message: "User not found" });
    const query = Location.findOne({ name: req.params.city }).select("");
    query.exec(async (err, loc) => {
      if (err) res.status(500).json({ message: "Error on the server" });
      if (!loc) res.status(404).json({ message: "Location not found" });
      if (!user.favouriteLocs.includes(loc._id)) {
        user.favouriteLocs.push(loc._id);
        await user.save();
      }
      console.log(user.favouriteLocs)
      //res.status(200).redirect("/location?favourites=true");
      res.status(200).json({ message: "Favourite Location Updated" });
    });
  });
});

/**
 * @swagger
 * /location/{city}/favourite:
 *  delete:
 *    description: Delete this city from user’s favourite list of locations
 *    tags: [Location]
 *    parameters:
 *      - in: path
 *        name: city
 *        required: true
 *        schema:
 *          type: string
 *        description: Name of the city
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successfully deleted this city from favourite list of locations. Returns the updated list of user's favourite locations
 *        content:
 *          application/json:
 *            schema:           
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Location'
 *      404:
 *        description: Location or user not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error on the server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 */
router.delete("/:city/favourite", (req, res) => {
  User.findById(req.userId, (err, user) => {
    if (err) res.status(500).json({ message: "Error on the server" });
    if (!user) res.status(404).json({ message: "User not found" });
    const query = Location.findOne({ name: req.params.city }).select("");
    query.exec(async (err, loc) => {
      if (err) res.status(500).json({ message: "Error on the server" });
      if (!loc) res.status(404).json({ message: "Location not found" });
      if (user.favouriteLocs.includes(loc._id)) {
        user.favouriteLocs = user.favouriteLocs.filter(
          (item) => !item.equals(loc._id)
        );
        await user.save();
      }
      //res.status(200).redirect("/location?favourites=true");
      res.status(200).json({ message: "Favourite Location Deleted" });
    });
  });
});

module.exports = router;
