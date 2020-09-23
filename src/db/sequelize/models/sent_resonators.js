"use strict";
module.exports = (sequelize, DataTypes) => {
    const sent_resonators = sequelize.define(
        "sent_resonators",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            resonator_id: DataTypes.UUID,
            failed: DataTypes.BOOLEAN,
            expiry_date: DataTypes.DATE,
        },
        { underscored: true }
    );

    sent_resonators.associate = (models) => {
        sent_resonators.belongsTo(models.resonators);
        sent_resonators.hasMany(models.resonator_answers);
    };

    return sent_resonators;
};
