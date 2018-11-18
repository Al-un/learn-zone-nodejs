class StaticPagesController {

    constructor() {
        // nothing
    }

    miscInfo(req, res, next) {
        var userInfo = res.locals.user
            ? { userInfo: JSON.stringify(res.locals.user, undefined, 2) }
            : { userInfo: 'no user is loaded' };
        var data_view = Object.assign({}, res.locals.data_view, userInfo);
        res.render('static/misc_info', data_view);
    }

}

module.exports = { StaticPagesController };