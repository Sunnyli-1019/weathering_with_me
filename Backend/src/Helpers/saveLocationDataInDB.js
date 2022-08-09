// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
const fetch = require("node-fetch");
const mongoose = require("mongoose"); 
const Location = require("../Models/Location");

// Cities supposed to be included in the database
const cities = [
  "Hongkong",
  "Bangkok",
  "London",
  "Singapore",
  "Paris",
  "Dubai",
  "Munich",
  "Istanbul",
  "Delhi",
  "NY",
  "Beijing",
  "Tokyo",
  "Rome",
  "Amsterdam",
  "LA",
  "Moscow",
  "Sydney",
  "Rio",
  "Capetown",
  "Shanghai"
];

const apiKey = require("./variables").apiKey;

// Get a location object by calling the API
const getLocFromAPI = async (city) => {
    const res = await (await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)).json();
    return res.location;
}

// Save location in db
const saveLocInDb = (loc) => {
    const newLoc = new Location({
        name: loc.name,
        country: loc.country,
        lat: loc.lat,
        long: loc.lon
    });
    newLoc.save((err, res) => {
        if(err) console.log(err);
        else console.log(res);
    });
}

// Save location data for all specified cities in the db
const saveCitiesInDB = async () => {
    for(let i = 0; i < cities.length; i++) {
        const loc = await getLocFromAPI(cities[i]);
        await saveLocInDb(loc);
    }
}

module.exports = saveCitiesInDB;

