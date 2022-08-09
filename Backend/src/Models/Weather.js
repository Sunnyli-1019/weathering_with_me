// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
const mongoose = require("mongoose");

const WeatherSchema = mongoose.Schema({
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true
    },
    lastUpdate: {
        type: Date,
        required: true
    },
    temp_c: Number,
    wind_kph: Number,
    wind_dir: String,
    humidity: Number,
    precip_mm: Number,
    vis_km: Number
});

module.exports = mongoose.model("Weather", WeatherSchema);
