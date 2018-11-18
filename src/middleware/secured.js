// const express = require('express');
// const app = express();
// const jwtAuthz = require('express-jwt-authz');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

/**
 * Check if current request is authenticated
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function handleAuthentication(req, res, next) {
    console.log(`Secured: checking authentication`);
    if (!req.user && !req.headers.authorization) {
        res.status(401);
        if (req.headers.accept.includes("text/html")) {
            console.log(`Authentication is required to access ${req.originalUrl}. Redirect to login`);
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
        else {
            console.log(`Authentication is required to access ${req.originalUrl}.`);
            res.json({ error: `Authentication is required to access ${req.originalUrl}` });
        }
    }
    else {
        next();
    }
}

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
/**
 * Check if the authenticated user has a valid access token
 */
const handleAuthorization = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
    getToken: function fromHeaderOrQueryString(req) {
        console.log(`Secured: checking authorization`);
        // JSON request: Authorization headers
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        }
        // HTML request: session storage
        else if (req.user && req.user.accessToken) {
            return req.user.accessToken;
        }
        else {
            console.log(`No token found`);
            return null;
        }
    }
});

/**
 * Fetch user local id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function loadUserId(req, res, next) {
    // console.log(`Secured: loading req.user: ${JSON.stringify(req.user)}`);
    // loading user
    User
        .findOne({ where: { auth0_id: req.user.sub } })
        .then(result => {
            if (result === undefined || result.length === 0) {
                // do some stuff
            }
            console.log(`Secured: result: ${JSON.stringify(result)}`);
            res.locals.user_id = result.id;
            return next();
        })
        .catch(err => next(new Error(err)));
}


// https://auth0.com/docs/quickstart/webapp/nodejs
/**
 * Check if user is authenticated and properly authorized
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


module.exports = [
    handleAuthentication,
    handleAuthorization,
    loadUserId
];