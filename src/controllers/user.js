const { AppController, Sequelize } = require('./app');
const { User } = require('../sequelize');

class UserController extends AppController {

    constructor() {
        super(User);
    }
    
    formatSearchOptions(query_params) {
        var set = {};

        if(query_params.auth0_id){
            set['auth0_id'] = { [Sequelize.Op.like]: `%${query_params.auth0_id}%` };
        }

        return set;
    }
}

module.exports = { UserController };
