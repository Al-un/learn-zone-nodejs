/**
 * Handling routing for Express
 * Sources:
 * https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
 * https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
 */

// Express router
const routes = require("express").Router();

// Load routes
const auth = require("./auth");
const articles = require("./articles");
const catalogs = require("./catalogs");
const article_publications = require("./articlePublications");
const users = require("./users");
const staticPages = require("./staticPages");

// Assign routes
routes.use("/", auth);
routes.use("/", staticPages);
routes.use("/article_publications", article_publications);
routes.use("/articles", articles);
routes.use("/catalogs", catalogs);
routes.use("/users", users);

module.exports = routes;
