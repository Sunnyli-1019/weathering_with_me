// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
// This file is supposed to update the weather information in the weather table
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const Location = require("../Models/Location");
const Weather = require("../Models/Weather");

const apiKey = require("./variables").apiKey;

// Retrieve weather data for one particular city from API
const getWeatherDataFromAPI = async (city) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
    ).then(
      res => res.json()
    ).then(
      res => resolve(res.current)
    ).catch(
      err => resolve(null)
    )
  })
};

// Refresh the weather data in the db by fetching the most recent data from the Weather API
// return true if success
const refreshWeatherData = () => {
  return new Promise((resolve, reject) => {
    Location.find({}, async (err, locations) => {
      if (err) {
        console.log(err);
        resolve(false);
      } else {
        for await (loc of locations) {
          const weatherAPIdata = await getWeatherDataFromAPI(loc.name);
          if (weatherAPIdata == null) {
            //console.log(`${loc.name}: nulled`);
            continue;
          }
          //console.log(`${loc.name}: ${weatherAPIdata.temp_c}`);
          Weather.findOne({ location: loc._id }, async (err, weather) => {
            if (err) {
              console.log(err);
              resolve(false);
            } else if (weather == null) {
              const newWeather = new Weather({
                lastUpdate: Date.now(),
                location: loc._id,
                temp_c: weatherAPIdata.temp_c,
                wind_kph: weatherAPIdata.wind_kph,
                wind_dir: weatherAPIdata.wind_dir,
                humidity: weatherAPIdata.humidity,
                precip_mm: weatherAPIdata.precip_mm,
                vis_km: weatherAPIdata.vis_km,
              });
              try {
                await newWeather.save();
              }
              catch {
                resolve(false);
              }
            } else {
              weather.lastUpdate = Date.now();
              weather.temp_c = weatherAPIdata.temp_c;
              weather.wind_kph = weatherAPIdata.wind_kph;
              weather.wind_dir = weatherAPIdata.wind_dir;
              weather.humidity = weatherAPIdata.humidity;
              weather.precip_mm = weatherAPIdata.precip_mm;
              weather.vis_km = weatherAPIdata.vis_km;
              try {
                await weather.save();
              }
              catch {
                resolve(false);
              }
            }
          });
        }
        resolve(true);
      }
    });
  });
};

module.exports = refreshWeatherData;
