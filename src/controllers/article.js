const { AppController, Sequelize } = require("./app");
const { Article, ArticlePublication } = require("../models/sequelize");

class ArticleController extends AppController {
    constructor() {
        super(Article, "articles");
    }

    createParams(req, res) {
        var params = req.body;
        Object.assign(params, { user_id: res.locals.user_id });
        return params;
    }

    updateParams(req, res) {
        var params = req.body;
        // [TMP-001] !!!!
        Object.assign(params, { user_id: res.locals.user_id });
        return params;
    }

    formatSearchOptions(query_params) {
        var set = {};

        if (query_params.name) {
            set["name"] = { [Sequelize.Op.like]: `%${query_params.name}%` };
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
