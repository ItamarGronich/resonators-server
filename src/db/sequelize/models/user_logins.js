"use strict";
module.exports = (sequelize, DataTypes) => {
    const user_logins = sequelize.define(
        "user_logins",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            user_id: DataTypes.UUID,
            user_agent: DataTypes.TEXT,
            ip: DataTypes.STRING,
            status: DataTypes.INTEGER,
        },
        { underscored: true }
    );

    user_logins.associate = (models) => {
        user_logins.belongsTo(models.users);
    };

    return user_logins;
};
