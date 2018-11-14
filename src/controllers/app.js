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
class AppController {

    /**
     * Instantiate a controller.
     * 
     * Binding is required otherwise the `this` object is `undefined` when calling
     * methods.
     * 
     * @param {Model} model model attached to this controller. Used for querying 
     */
    constructor(model) {
        this._model = model;
        this.list = this.list.bind(this);
        this.show = this.show.bind(this);
        this.create = this.create.bind(this);
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
            .then(entities => res.json(entities))
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
        this._model
            .findByPk(id)
            .then(entity => res.json(entity))
            .catch(error => res.status(400).send(error));
    }

    /**
     * Create an entity in database
     * @param {http.IncomingMessage} req incoming request
     * @param {http.ServerResponse} res output response 
     * @param {function} next next middleware function
     */
    create(req, res, next) {
        this._model
            .create(req.body)
            .then(entity => { res.json(entity) })
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
            .then(entity => res.sendStatus(204))
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
                if (deletionStatus === 1) {
                    res.status(200).end('Deleted');
                }
                else {
                    res.status(400).end('Deletion has failed');
                }
            })
    }

}

module.exports = AppController;
