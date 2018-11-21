// Auth0 configuration
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
    // state is by default true
    state: true
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    // console.log("--------- Calling Auth0 Strategy");
    // console.log("AccessToken: " + JSON.stringify(accessToken));
    // console.log("RefreshToken: " + JSON.stringify(refreshToken));
    // console.log("ExtraParams: " + JSON.stringify(extraParams));
    // console.log("Profile: " + JSON.stringify(profile));
    // console.log("--------- /Auth0 Strategy");
    profile['accessToken'] = accessToken;
    return done(null, profile);
  }
);

passport.use(strategy);

// optional
// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
  pouet = done(null, user);
  // console.log("Serializing user: " + JSON.stringify(user));
  return pouet;
});

passport.deserializeUser(function (user, done) {
  pouet = done(null, user);
  // console.log("Deserializing user: " + JSON.stringify(user));
  return pouet;
});

module.exports = passport;