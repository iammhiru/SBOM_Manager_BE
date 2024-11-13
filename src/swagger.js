const dotenv = require("dotenv");
dotenv.config();
const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "Project 3 Backend",
    description: "Project 3 Backend",
  },
  host: `localhost:3000/api/v1`,
  schemes: "https",
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header", // can be 'header', 'query' or 'cookie'
      name: "apiSecret", // name of the header, query parameter or cookie
      description: "Some description...",
    },
    userId: {
      type: "apiKey",
      in: "header",
      name: "userId",
      description: "Some description...",
    },
  },
};

const outputFile = "./swagger.json";
const routes = [
  "./routes/user.route",
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
