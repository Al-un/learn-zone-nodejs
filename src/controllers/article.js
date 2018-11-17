const { AppController, Sequelize } = require('./app');
const { Article } = require('../sequelize');

class ArticleController extends AppController {

    constructor() {
        super(Article, 'articles');
    }

    formatSearchOptions(query_params) {
        var set = {};

        if (query_params.name) {
            set['name'] = { [Sequelize.Op.like]: `%${query_params.name}%` };
        }

        return set;
    }

    getSingleEntityFetchOptions() {
        return { include: [{ model: ArticlePublication }] };
    }

    getEntitiesListFetchOptions() {
        return {};
    }
}

module.exports = { ArticleController };
