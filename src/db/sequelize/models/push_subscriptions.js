"use strict";
module.exports = function (sequelize, DataTypes) {
    const push_subscriptions = sequelize.define(
        "push_subscriptions",
        {
            endpoint: {
                type: DataTypes.STRING(500),
                primaryKey: true,
            },
            keys: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            last_sent: DataTypes.DATE,
        },
        {
            underscored: true,
            classMethods: {
                associate: function (models) {
                    push_subscriptions.belongsTo(models.users);
                },
            },
        }
    );
    return push_subscriptions;
};
