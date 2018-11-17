const AppController = require('./app')
const { Article } = require('../sequelize');

class ArticleController extends AppController {

    constructor() {
        super(Article, 'articles');
    }

}

module.exports = { ArticleController };
