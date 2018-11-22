const { AppController, Sequelize } = require("./app");
const { User } = require("../models/sequelize");

class UserController extends AppController {
    constructor() {
        super(User);
    }

    formatSearchOptions(queryParams) {
        var set = {};

        if (queryParams.auth0_id) {
            set["auth0_id"] = {
                [Sequelize.Op.like]: `%${queryParams.auth0_id}%`
            };
        }

        return set;
    }
}

module.exports = { UserController };
