const { Sequelize } = require('sequelize');
const respond = require('./helper/responder');
/**
 * Most basic version of a controller related to a given entity
 * 
 * Request / Response:
 * https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
 * - Request is an instance of `IncomingMessage`: 
 * https://nodejs.org/api/http.html#http_class_http_incomingmessage
 * - Response is an instance of `ServerResponse`:
 * https://nodejs.org/api/http.html#http_class_http_serverresponse
 * 
 * Source:
 *  > Abstract Controller:
 *  https://blog.cloudboost.io/node-express-controller-inheritance-2d5b2661ee7d
 *  > Crud with Sequelize:
 *  https://lorenstewart.me/2016/10/03/sequelize-crud-101/
 */
const view_new = '/new';
const view_show = '/show';
const view_edit = '/edit';
const view_list = '/list';

class AppController {


    /**
     * Instantiate a controller.
     * 
     * Binding is required otherwise the `this` object is `undefined` when calling
     * methods.
     * 
     * @param {Model} model model attached to this controller. Used for querying 
     */
    constructor(model, route_root) {
        this._model = model;
        this._route = route_root;
        this.list = this.list.bind(this);
        this.show = this.show.bind(this);
        this.new = this.new.bind(this);
        this.create = this.create.bind(this);
        this.edit = this.edit.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.search = this.search.bind(this);
    }

    /**
     * List all entities
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    list(req, res, next) {
        this._model
            .findAll(this.getEntitiesListFetchOptions())
            .then(entities => {
                res.locals.render = this._route + view_list;
                res.locals.data_json = entities;
                res.locals.data_view = { list: entities };
                res.locals.status = 200;
                respond(req, res, next);
            })
            .catch(error => res.status(400).send(error));
    }

    /**
     * Display a specific entitiy, based on :id parameter
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    show(req, res, next) {
        var id = req.params.id;
        console.log(`Showing entity for PK ${id}`);
        this._model
            .findByPk(id, this.getSingleEntityFetchOptions())
            .then(entity => {
                res.locals.render = this._route + view_show;
                res.locals.data_json = entity;
                res.locals.data_view = { entity: entity };
                res.locals.status = 200;
                respond(req, res, next);
            })
            .catch(error => res.status(400).send(error));
    }

    /**
     * Prepare to create an entity in database
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    new(req, res, next) {
        res.locals.render = this._route + view_new;
        res.locals.status = 204; // nothing to send for JSON
        respond(req, res, next);
    }

    /**
     * Create an entity in database
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    create(req, res, next) {
        var createParams = this.createParams(req, res);
        console.log(`Creating with body (parameters): ${JSON.stringify(createParams)}`);
        this._model
            .create(createParams)
            .then(entity => {
                res.locals.redirect = req.body.source || this._route + '/' + entity.id;
                res.locals.data_json = entity;
                res.locals.data_view = { entity: entity };
                res.locals.status = 201;
                respond(req, res, next);
            })
            .catch(error => res.status(400).send(error));
    }

    /**
     * Edit an entitiy in database
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    edit(req, res, next) {
        var id = req.params.id;
        this._model
            .findByPk(id, this.getSingleEntityFetchOptions())
            .then(entity => {
                res.locals.render = this._route + view_edit;
                res.locals.data_json = entity;
                res.locals.data_view = { entity: entity };
                res.locals.status = 200;
                respond(req, res, next);
            })
            .catch(error => res.status(400).send(error));
    }

    /**
     * Update an entitiy in database
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    update(req, res, next) {
        var updateParams = this.updateParams(req, res);
        console.log(`Updating with body (parameters): ${JSON.stringify(updateParams)}`);
        this._model
            .update(
                updateParams,
                { where: { id: req.params.id } }
            )
            .then(entity => {
                res.locals.status = 204; // JSON response
                res.locals.redirect = this._route + '/' + req.params.id; // HTML Response
                respond(req, res, next);
            })
            .catch(error => res.status(400).send(error));
    }

    /**
     * Delete an entity from database
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    delete(req, res, next) {
        var to_destroy_id = req.params.id;
        this._model
            // Destroy by primary key
            .destroy({
                where: { id: to_destroy_id }
            })
            // Status: 1 = success, 0 = error
            .then(deletionStatus => {
                res.locals.redirect = req.body.source || this._route;
                if (deletionStatus === 1) {
                    res.locals.status = 200;
                    res.locals.message = 'Deleted';
                }
                else {
                    res.locals.status = 400;
                    res.locals.message = 'Deletion has failed';
                }
                respond(req, res, next);
            })
    }

    /**
     * Search function. Can be rationalized in the abstract class as Sequelize
     * allows sets as parameter: we simple pass the req.body as parameters.
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    search(req, res, next) {
        var search_options = this.formatSearchOptions(req.query);
        console.log(`Searching with query parameters: ${JSON.stringify(search_options)}`);
        this._model
            .findAll(search_options)
            .then(entities => {
                res.locals.data_json = entities;
                res.locals.data_view = { list: entities };
                res.locals.status = 200;
                respond(req, res, next);
            })
            .catch(error => res.status(400).send(error));
    }

    // ---------- Support methods ----------------------------------------------

    /**
     * Define parameters for entity creation
     * @param {*} req 
     * @param {*} res
     */
    createParams(req, res) {
        return req.body;
    }

    /**
     * Define parameters for entity update
     * @param {*} req 
     * @param {*} res
     */
    updateParams(req, res) {
        return req.body;
    }

    /**
     * Convert search input into appropriate search parameters for WHERE clause.
     * Search parameters are merged with .getEntitiesListFetchOptions to add
     * additional fields if required
     * 
     * @param {Object} query_parameters 
     * @return {Object} formatted options
     * @see .getEntitiesListFetchOptions
     */
    formatSearchOptions(query_parameters) {
        return query_parameters;
    }

    /**
     * @return {Object} options to pass when fetching a single entity
     */
    getSingleEntityFetchOptions() {
        return {};
    }

    /**
     * @return {Object} options to pass when fetching multiple entities
     */
    getEntitiesListFetchOptions() {
        return {};
    }
}

module.exports = {
    AppController,
    Sequelize
};
