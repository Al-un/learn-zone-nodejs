module.exports = (sequelize, type) => {
    return sequelize.define(
        "user",
        // columns definition
        {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            auth0_id: {
                type: type.STRING,
                allowNull: false
            }
        },
        // options
        {
            tableName: "users",
            timestamps: true,
            underscored: true
        }
    );
};
