module.exports = (sequelize, type) => {
    return sequelize.define(
        "article",
        // columns definition
        {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: type.STRING,
                allowNull: false
            },
            description: type.STRING,
            user_id: {
                type: type.INTEGER,
                references: {
                    model: "user",
                    key: "id"
                }
            }
        },
        // options
        {
            tableName: "articles",
            timestamps: true,
            underscored: true
        }
    );
};
