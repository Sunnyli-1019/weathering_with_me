// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
const { stringify } = require("nodemon/lib/utils");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Weathering With Me API",
      version: "1.0.0",
      description: "Weathering With Me API Information",
    },
    servers: [
      {
        url: "http://localhost:3000", // url
        description: "Local server", // name
      },
      {
        url: "https://weathering-with-me-g12.herokuapp.com", // url
        description: "Production server", // name
      },
    ],
  },
  apis: ["./src/Routes/*.js"],
};

module.exports = swaggerJsDoc(swaggerOptions);

