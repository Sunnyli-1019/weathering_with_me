// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
/* ============================
Imports
===============================*/
// Import modules
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const bodyParser = require("body-parser");
// Import configurations
const swaggerDocs = require("./Config/configureSwagger");
// Import routes
const locationRoute = require("./Routes/Location");
const userRoutes = require("./Routes/User");
const authRoutes = require("./Routes/Auth");
// Import helpers
// ...

/* ============================
Configure App
===============================*/
// app variables
const port = process.env.PORT || 3000;
const app = express();
// Allow request to API from all origins
app.use(cors());
// Set swagger UI API doc path
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Set routes
app.use("/location", locationRoute);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
// Set content type to json for all requests
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});
// Use body-parser in every request
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", bodyParser.json());

// Establish connection to the database
mongoose.connect(
    ""
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", function () {
  console.log("Connection is open...");
});

/* ============================
Routes
===============================*/
/**
 * @swagger
 * /:
 *  get:
 *    description: entry point to REST API
 */
app.get("/", (req, res) => {
    res.status(200).json({message: `Welcome to the Weathering With Me Group 12 API server ${__dirname}`});
});

// Start the web server
app.listen(port);