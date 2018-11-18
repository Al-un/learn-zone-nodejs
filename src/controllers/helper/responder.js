module.exports = (req, res, next) => {
    console.log(`Responding to ${req.method}${req.originalUrl} with format ${req.headers.accept}`);
    if (req.headers.accept.includes("text/html")) {
        if (res.locals.render) {
            console.log(`Rendering view ${res.locals.render}`);
            var data_view = Object.assign({}, res.locals.data_view, res.locals.user);
            res.render(res.locals.render, data_view);
        }
        else if (res.locals.redirect) {
            console.log(`Redirecting to ${res.locals.redirect}`);
            res.redirect("/" + res.locals.redirect);
        }
        else {
            console.log(`No view provided for data ${res.locals.data_view} Next() called.`);
            return next();
        }
    }
    else if (req.headers.accept.includes("application/json")) {
        console.log('Render a JSON response');
        // data?
        if (res.locals.data_json) {
            var status = res.locals.status || 200;
            res.status(status).json(res.locals.data_json);
        }
        else if (res.locals.status) {
            var status = res.locals.status || 200;
            var message = res.locals.message || "";
            res.status(status).send(message);
        }
        else {
            return next();
        }
    }
    else {
        // Invalid format
        console.log(`Invalid format ${req.headers.accept}. 400 error is returned`);
        res.sendStatus(400);
    }
    // next();
};