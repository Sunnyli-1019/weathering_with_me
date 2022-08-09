// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  comments: [
    {
      author: {
        type: String,
        required: true,
      },
      text: String,
    },
  ],
});

module.exports = mongoose.model("Location", LocationSchema);
