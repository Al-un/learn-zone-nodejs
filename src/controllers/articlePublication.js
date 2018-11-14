const AppController = require('./app')
const { ArticlePublication } = require('../sequelize');

class ArticlePublicationController extends AppController {

    constructor() {
        super(ArticlePublication);
    }

}

module.exports = { ArticlePublicationController };
