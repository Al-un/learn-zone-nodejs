module.exports = (sequelize, type) => {
    return sequelize.define(
        "article_publication",
        // columns definition
        {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            article_id: {
                type: type.INTEGER,
                references: { model: "article", key: "id" }
            },
            catalog_id: {
                type: type.INTEGER,
                references: { model: "catalog", key: "id" }
            }
        },
        // options
        {
            tableName: "article_publications",
            timestamps: true,
            underscored: true
        }
    );
};
