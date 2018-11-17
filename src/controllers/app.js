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
        this.parse_new_or_show = this.parse_new_or_show.bind(this);
        this.show = this.show.bind(this);
        this.new = this.new.bind(this);
        this.create = this.create.bind(this);
        this.edit = this.edit.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * List all entities
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    list(req, res, next) {
        this._model.findAll()
            .then(entities => {
                res.locals.render = this._route + view_list;
                res.locals.data = { list: entities };
                res.locals.status = 200;
                return next();
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
            .findByPk(id, { include: [{ model: ArticlePublication }] })
            .then(entity => {
                res.locals.render = this._route + view_show;
                res.locals.data = { entity: entity };
                res.locals.status = 200;
                return next();
            })
            .catch(error => res.status(400).send(error));
    }

    /**
     * When filtering `/:id` path, return `new` function when id is `new`
     * otherwise use `show`
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    parse_new_or_show(req, res, next) {
        return 'new' === req.params.id
            ? this.new(req, res, next)
            : this.show(req, res, next);
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
        return next();
    }

    /**
     * Create an entity in database
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    create(req, res, next) {
        console.log(`Creating with body (parameters): ${JSON.stringify(req.body)}`);
        this._model
            .create(req.body)
            .then(entity => {
                res.locals.redirect = this._route + '/' + entity.id;
                res.locals.data = entity;
                res.locals.status = 201;
                return next();
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
            .findByPk(id)
            .then(entity => {
                res.locals.render = this._route + view_edit;
                res.locals.data = { entity: entity };
                res.locals.status = 200;
                return next();
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
        this._model
            .update(
                req.body,
                { where: { id: req.params.id } }
            )
            .then(entity => {
                res.locals.status = 204; // JSON response
                res.locals.redirect = this._route + '/' + req.params.id; // HTML Response
                return next();
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
                res.locals.redirect = this._route;
                if (deletionStatus === 1) {
                    res.locals.status = 200;
                    res.locals.message = 'Deleted';
                }
                else {
                    res.locals.status = 400;
                    res.locals.message = 'Deletion has failed';
                }
                return next();
            })
    }

}

module.exports = AppController;
