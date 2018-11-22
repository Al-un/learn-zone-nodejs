// https://www.codementor.io/mirko0/how-to-use-sequelize-with-node-and-express-i24l67cuz

const Sequelize = require("sequelize");
// Fetch definition
const UserModel = require("./user.js");
const ArticleModel = require("./article.js");
const CatalogModel = require("./catalog.js");
const ArticlePublicationModel = require("./articlePublication.js");

// initialize
const DB_URL = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : process.env.DATABASE_DEV_URL || "invalid URL";

const sequelize = new Sequelize(DB_URL, {
    host: "localhost",
    dialect: "postgres",

    // Pooling
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // https://github.com/sequelize/sequelize/issues/8417#issuecomment-334056048
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-security
    operatorsAliases: false
});

// Define models
var User = UserModel(sequelize, Sequelize);
var Article = ArticleModel(sequelize, Sequelize);
var Catalog = CatalogModel(sequelize, Sequelize);
var ArticlePublication = ArticlePublicationModel(sequelize, Sequelize);

// Define associations
Article.belongsTo(User);
Catalog.belongsTo(User);
Article.hasMany(ArticlePublication);
Catalog.hasMany(ArticlePublication);
Article.belongsToMany(Catalog, { through: "ArticlePublication" });
Catalog.belongsToMany(Article, { through: "ArticlePublication" });

// Sync DB
// sequelize.sync()
//     .then(() => {
//         console.log(`Database synchronized`)
//     })

// Export defined models
module.exports = {
    User,
    Article,
    Catalog,
    ArticlePublication
};
