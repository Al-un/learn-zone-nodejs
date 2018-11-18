var router = require('express').Router();
var passport = require('passport');

// Perform the login, after login Auth0 will redirect to callback
//
// Adding Audience: https://github.com/auth0/passport-auth0#usage
router.get('/login', passport.authenticate('auth0', {
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid email profile'
}), function (req, res) {
    res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/');
        });
    })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
    req.logout();
    // https://auth0.com/docs/logout
    // https://community.auth0.com/t/log-out-doesnt-work-and-automatically-sign-in/14826/6
    res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.AUTH0_RETURN_FROM_LOGOUT}`);
});

module.exports = router;