"use strict";
module.exports = (sequelize, DataTypes) => {
    const resonator_attachments = sequelize.define(
        "resonator_attachments",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            resonator_id: DataTypes.UUID,
            media_kind: DataTypes.STRING,
            media_format: DataTypes.STRING,
            media_id: DataTypes.STRING,
            title: DataTypes.STRING,
            visible: DataTypes.INTEGER,
            owner_id: DataTypes.UUID,
            owner_role: DataTypes.STRING,
            link: DataTypes.STRING,
        },
        { underscored: true }
    );

    resonator_attachments.associate = (models) => {
        resonator_attachments.belongsTo(models.resonators);
    };
    
    return resonator_attachments;
};
