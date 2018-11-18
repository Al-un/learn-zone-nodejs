const { User } = require('../sequelize');
const { Sequelize } = require('sequelize');

module.exports = function () {
    return function (req, res, next) {
        if (req.user) {
            res.locals.user = req.user;
            res.locals.user_id = User.findAll({
                where: {
                    auth0_id: req.user.id
                }
            });
        }
        next();
    };
};