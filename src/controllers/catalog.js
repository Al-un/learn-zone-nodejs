const { AppController, Sequelize } = require("./app");
const { Catalog } = require("../models/sequelize");

class CatalogController extends AppController {
    constructor() {
        super(Catalog, "catalogs");
    }

    createParams(req, res) {
        return this.mergeParamsWithUser(req.body, res);
    }

    formatSearchOptions(query_params) {
        var search_options = {};

        if (query_params.name) {
            search_options["name"] = {
                [Sequelize.Op.like]: `%${query_params.name}%`
            };
        }
        if (query_params.code) {
            search_options["code"] = {
                [Sequelize.Op.like]: `%${query_params.code}%`
            };
        }

        var search_options = Object.assign(
            {},
            { where: search_options },
            this.getEntitiesListFetchOptions()
        );

        return search_options;
    }

    getSingleEntityFetchOptions() {
        return { include: [{ model: ArticlePublication }] };
    }

    getEntitiesListFetchOptions() {
        return {};
    }
}

module.exports = { CatalogController };
