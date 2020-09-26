"use strict";
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define(
        "users",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            pass: DataTypes.STRING,
            salt: DataTypes.STRING,
            country: DataTypes.STRING,
            unsubscribed: DataTypes.BOOLEAN,
        },
        { underscored: true }
    );

    users.associate = (models) => {
        users.hasOne(models.leaders);
        users.hasOne(models.followers);
        users.hasOne(models.user_password_resets);
        users.hasMany(models.push_subscriptions);
    };

    return users;
};
