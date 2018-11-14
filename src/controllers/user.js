const AppController = require('./app')
const { User } = require('../sequelize');

class UserController extends AppController {

    constructor() {
        super(User);
    }

}

module.exports = { UserController };
