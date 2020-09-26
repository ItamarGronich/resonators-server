"use strict";
module.exports = (sequelize, DataTypes) => {
    const push_subscriptions = sequelize.define(
        "push_subscriptions",
        {
            endpoint: { type: DataTypes.STRING(500), primaryKey: true },
            keys: { type: DataTypes.JSON, allowNull: false },
            last_sent: DataTypes.DATE,
        },
        { underscored: true }
    );

    push_subscriptions.associate = (models) => {
        push_subscriptions.belongsTo(models.users);
    };

    return push_subscriptions;
};
