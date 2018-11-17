/**
 * Handling routing for Express
 * Sources:
 * https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
 * https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
 */

// Express router
const routes = require('express').Router();

// Load routes
const articles = require('./articles');
const catalogs = require('./catalogs');
const article_publications = require('./articlePublications');
const users = require('./users');

// Assign routes
routes.use('/article_publications', article_publications);
routes.use('/articles', articles);
routes.use('/catalogs', catalogs);
routes.use('/users', users);

// Static routes
// routes.get('/', (req, res, next) => {
//     console.log(req.format);
//     console.log(JSON.stringify(req.headers));
//     console.log(JSON.stringify(req.httpVersion));
//     console.log(JSON.stringify(req.method));
//     console.log(JSON.stringify(req.rawHeaders));
//     res.status(200).json({ message: 'Connected!' });
// });
routes.get('/', (req, res, next) => {
    res.locals.render = 'welcome'
    res.locals.data = { ip_address: req.connection.remoteAddress }
    // res.render('welcome', { ip_address: req.connection.remoteAddress });
    return next();
});

module.exports = routes;