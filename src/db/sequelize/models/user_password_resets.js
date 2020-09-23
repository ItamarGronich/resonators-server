"use strict";
module.exports = (sequelize, DataTypes) => {
    const user_password_resets = sequelize.define(
        "user_password_resets",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            user_id: DataTypes.UUID,
        },
        { underscored: true }
    );

    user_password_resets.associate = (models) => {
        user_password_resets.belongsTo(models.users);
    };

    return user_password_resets;
};
