"use strict";
module.exports = (sequelize, DataTypes) => {
    const invitations = sequelize.define(
        "invitations",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            user_id: DataTypes.UUID,
            subject: DataTypes.STRING,
            body: DataTypes.STRING,
        },
        { underscored: true }
    );

    invitations.associate = (models) => {
        invitations.belongsTo(models.users);
    };

    return invitations;
};
