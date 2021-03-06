module.exports = (req, res, next) => {
    console.log(
        `Responding to ${req.method}${req.originalUrl} with format ${
            req.headers.accept
        }`
    );

    // HTML response
    if (req.headers.accept.includes("text/html")) {
        const dataView = res.locals.dataView;
        // Redirection has precedence over rendering
        if (res.locals.redirect) {
            console.log(`Redirecting to ${res.locals.redirect}`);
            res.redirect("/" + res.locals.redirect);
        }
        // View rendering
        else if (res.locals.render) {
            console.log(`Rendering view ${res.locals.render}`);
            const userDataView = Object.assign({}, dataView, res.locals.user);
            res.render(res.locals.render, userDataView);
        }
        // Backed to default behaviour
        else {
            console.log(`No view provided for data ${dataView} Next() called.`);
            return next();
        }
    }

    // JSON response
    else if (req.headers.accept.includes("application/json")) {
        console.log("Render a JSON response");
        // data?
        if (res.locals.dataJson) {
            var status = res.locals.status || 200;
            res.status(status).json(res.locals.dataJson);
        } else if (res.locals.status) {
            var status = res.locals.status || 200;
            var message = res.locals.message || "";
            res.status(status).send(message);
        } else {
            return next();
        }
    } else {
        // Invalid format
        console.log(
            `Invalid format ${req.headers.accept}. 400 error is returned`
        );
        res.sendStatus(400);
    }
    // next();
};
