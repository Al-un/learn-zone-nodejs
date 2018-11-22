module.exports = (sequelize, type) => {
    return sequelize.define(
        "catalog",
        // columns definition
        {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            code: {
                type: type.STRING,
                allowNull: false,
                unique: true
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
            tableName: "catalogs",
            timestamps: true,
            underscored: true
        }
    );
};
