module.exports = function() {
    /**
     * Loading logged-in user only for HTML requests
     */
    return function(req, res, next) {
        // console.log(`Loading User in res.locals: ${JSON.stringify(req.user)}`);
        res.locals.user = req.user;
        next();
    };
};
