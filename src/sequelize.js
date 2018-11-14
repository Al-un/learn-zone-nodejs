// https://www.codementor.io/mirko0/how-to-use-sequelize-with-node-and-express-i24l67cuz

const Sequelize = require('sequelize')
// Fetch definition
const UserModel = require('./models/user.js')
const ArticleModel = require('./models/article.js')
const CatalogModel = require('./models/catalog.js')
const ArticlePublicationModel = require('./models/articlePublication.js')

// initialize
const DB_URL = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : process.env.DATABASE_DEV_URL
        ? process.env.DATABASE_DEV_URL
        : 'invalid URL';
const sequelize = new Sequelize(DB_URL, {
    host: 'localhost',
    dialect: 'postgres',

    // Pooling
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // https://github.com/sequelize/sequelize/issues/8417#issuecomment-334056048
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-security
    operatorsAliases: false
})

// Define models
User = UserModel(sequelize, Sequelize)
Article = ArticleModel(sequelize, Sequelize)
Catalog = CatalogModel(sequelize, Sequelize)
ArticlePublication = ArticlePublicationModel(sequelize, Sequelize)

// Define associations
Article.hasOne(User)
Catalog.hasOne(User)
Article.hasMany(ArticlePublication)
Catalog.hasMany(ArticlePublication)
Article.belongsToMany(Catalog, { through: 'ArticlePublication' })
Catalog.belongsToMany(Article, { through: 'ArticlePublication' })

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
}