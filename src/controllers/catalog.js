const AppController = require('./app')
const { Catalog } = require('../sequelize');

class CatalogController extends AppController {

    constructor() {
        super(Catalog, 'catalogs');
    }

}

module.exports = { CatalogController };
