const { Sequelize } = require("sequelize");
const respond = require("./helper/responder");
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
const VIEW_NEW = "/new";
const VIEW_SHOW = "/show";
const VIEW_EDIT = "/edit";
const VIEW_LIST = "/list";

class AppController {
    /**
     * Instantiate a controller.
     *
     * Binding is required otherwise the `this` object is `undefined` when calling
     * methods.
     *
     * @param {Model} model model attached to this controller. Used for querying
     * @param {String} routeRoot route root name to redirect after operations such as creation
     */
    constructor(model, routeRoot) {
        this._model = model;
        this._route = routeRoot;
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
            .then(entities =>
                this.renderData(req, res, next, {
                    data: entities,
                    render: this._route + VIEW_LIST
                })
            )
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
            .then(entity =>
                this.renderData(req, res, next, {
                    data: entity,
                    render: this._route + VIEW_SHOW
                })
            )
            .catch(error => res.status(400).send(error));
    }

    /**
     * Prepare to create an entity in database
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response
     * @param {function} next next middleware function
     */
    new(req, res, next) {
        this.renderData(req, res, next, {
            status: 204,
            render: this._route + VIEW_NEW
        });
    }

    /**
     * Create an entity in database
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response
     * @param {function} next next middleware function
     */
    create(req, res, next) {
        var createParams = this.createParams(req, res);
        console.log(
            `Creating with body (parameters): ${JSON.stringify(createParams)}`
        );
        this._model
            .create(createParams)
            .then(entity =>
                this.renderData(req, res, next, {
                    redirect: this._route + "/" + entity.id,
                    data: entity,
                    status: 201
                })
            )
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
            .then(entity =>
                this.renderData(req, res, next, {
                    data: entity,
                    render: this._route + VIEW_EDIT
                })
            )
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
        console.log(
            `Updating with body (parameters): ${JSON.stringify(updateParams)}`
        );
        this._model
            .update(updateParams, { where: { id: req.params.id } })
            .then(entity =>
                this.renderData(req, res, next, {
                    status: 204,
                    redirect: this._route + "/" + req.params.id
                })
            )
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
                    res.locals.message = "Deleted";
                } else {
                    res.locals.status = 400;
                    res.locals.message = "Deletion has failed";
                }
                respond(req, res, next);
            });
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
        console.log(
            `Searching with query parameters: ${JSON.stringify(search_options)}`
        );
        this._model
            .findAll(search_options)
            .then(entities =>
                this.renderData(req, res, next, entities, undefined, 200)
            )
            .catch(error => res.status(400).send(error));
    }

    // ---------- Support methods ----------------------------------------------

    mergeParamsWithUser(params, res) {
        return Object.assign({}, params, { user_id: res.locals.user_id });
    }

    /**
     * Define parameters for entity creation
     * @param {*} req
     * @param {*} res
     */
    createParams(req, _res) {
        return req.body;
    }

    /**
     * Define parameters for entity update
     * @param {*} req
     * @param {*} res
     */
    updateParams(req, _res) {
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

    /**
     * Responding for a given entity based on output. Output attributes are:
     * - data: entities list or a single entity
     * - redirect: redirected page. Overridden by req.body.source
     * - render: rendered view full path (root included)
     * - status: default to 200
     * - message: if a custom message has to be added
     * @param {*} output output object
     */
    renderData(req, res, next, output) {
        // mandatory status
        res.locals.status = output.status || 200;
        // Path: source has precedence
        res.locals.redirect = req.body.source || output.redirect;
        // Relative path
        res.locals.render = output.render;
        // Data: JSON
        res.locals.dataJson = output.data;

        // optional data
        if (output.data) {
            res.locals.dataView =
                output.data.constructor === Array
                    ? { list: output.data }
                    : { entity: output.data };
        }

        respond(req, res, next);
    }
}

module.exports = {
    AppController,
    Sequelize
};
