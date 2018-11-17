const AppController = require('./app')
const { ArticlePublication } = require('../sequelize');

class ArticlePublicationController extends AppController {

    constructor() {
        super(ArticlePublication, 'article_publications');
    }

    delete(req, res, next) {
        var to_destroy_id = req.params.id;
        this._model
            // Destroy by primary key
            .destroy({
                where: { id: to_destroy_id }
            })
            // Status: 1 = success, 0 = error
            .then(deletionStatus => {
                res.locals.redirect = req.body.source;
                if (deletionStatus === 1) {
                    res.locals.status = 200;
                    res.locals.message = 'Deleted';
                }
                else {
                    res.locals.status = 400;
                    res.locals.message = 'Deletion has failed';
                }
                return next();
            })
    }
}

module.exports = { ArticlePublicationController };
