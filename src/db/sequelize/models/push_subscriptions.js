"use strict";
module.exports = function (sequelize, DataTypes) {
    const push_subscriptions = sequelize.define(
        "push_subscriptions",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            subscription: DataTypes.JSON,
            user_id: DataTypes.UUID,
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
