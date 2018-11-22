const { AppController, Sequelize } = require("./app");
const { ArticlePublication } = require("../models/sequelize");

class ArticlePublicationController extends AppController {
    constructor() {
        super(ArticlePublication, "article_publications");
    }
}

module.exports = { ArticlePublicationController };
