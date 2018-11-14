const AppController = require('./app')
const { Catalog } = require('../sequelize');

class CatalogController extends AppController {

    constructor() {
        super(Catalog);
    }

}

module.exports = { CatalogController };
