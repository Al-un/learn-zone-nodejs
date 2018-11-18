class StaticPagesController {

    constructor() {
        // nothing
    }


    /**
     * Home page
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    welcome(req, res, next) {
        // console.log(req.format);
        // console.log(JSON.stringify(req.headers));
        // console.log(JSON.stringify(req.httpVersion));
        // console.log(JSON.stringify(req.method));
        // console.log(JSON.stringify(req.rawHeaders));
        // res.status(200).json({ message: 'Connected!' });
        res.render('static/welcome', { ip_address: req.connection.remoteAddress });
    }

    /**
     * Display Auth0 information page
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    miscInfo(req, res, next) {
        var userInfo = res.locals.user
            ? { userInfo: JSON.stringify(res.locals.user, undefined, 2) }
            : { userInfo: 'no user is loaded' };
        var data_view = Object.assign({}, res.locals.data_view, userInfo);
        res.render('static/misc_info', data_view);
    }

}

module.exports = { StaticPagesController };