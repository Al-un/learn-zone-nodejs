// .env loading: 
// https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

// App config
const PORT = process.env.PORT || 3000;

// Express
const app =  require('./src/express');

// Auth0 authentication
const passport = require('./src/auth');
app.use(passport.initialize());
app.use(passport.session());
// Loading user
const loadUserForViews = require('./src/middleware/loadUserForView');
app.use(loadUserForViews());

// Routing
const routes = require('./src/routes')
app.use('/', routes)
// Responder
const responder = require('./src/middleware/responder.js');
app.use('/', responder);
// Error handling
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler());

// Run
app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})