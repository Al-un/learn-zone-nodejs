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
function handleMissingAuthentication(req, res, next) {
    if (!req.user && !req.headers.authorization) {
        console.log(`Authentication is required to access ${req.originalUrl}`);
        res.status(401);
        if (req.headers.accept.includes("text/html")) {
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
        else {
            res.json({ error: `Authentication is required to access ${req.originalUrl}` });
        }
    }
}

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
/**
 * Check if the authenticated user has a valid access token
 */
const handleAuthorizationCheck = jwt({
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
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        }
        else if (req.user && req.user.accessToken) {
            return req.user.accessToken;
        }
        else {
            console.log(`No token found`);
            return null;
        }
    }
});

// https://auth0.com/docs/quickstart/webapp/nodejs
module.exports = function () {
    return function secured(req, res, next) {
        // console.log(`Checking stored user: ${JSON.stringify(req.user)}`);
        // console.log(`Checking headers: ${JSON.stringify(req.headers)}`);

        if (!req.user && !req.headers.authorization) {
            handleMissingAuthentication(req, res, next);
        }
        else {
            handleAuthorizationCheck(req, res, next);
        }
    };
};