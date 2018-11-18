module.exports = function () {
    return function (err, req, res, next) {
        console.log(`[Error] ${err}`);
        var statusCode;
        // Auth0 error
        if (err.name === 'UnauthorizedError') {
            statusCode = 403;
        }

        // Unknown errors
        else {
            statusCode = 500;
        }

        // Render response
        res.status(statusCode);
        if (req.headers.accept.includes("text/html")) {
            res.render(`errors/${statusCode}`, { error: err });
        }
        else {
            res.json({ error: err });
        }
    };
};