"use strict";
module.exports = (sequelize, DataTypes) => {
    const leader_clinics = sequelize.define(
        "leader_clinics",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            clinic_id: DataTypes.UUID,
            leader_id: DataTypes.UUID,
            isPrimary: DataTypes.BOOLEAN,
            isLeaderAccepted: DataTypes.BOOLEAN,
        },
        { underscored: true }
    );

    leader_clinics.associate = (models) => {
        leader_clinics.belongsTo(models.clinics);
        leader_clinics.belongsTo(models.leaders);
    };

    leader_clinics.removeAttribute("id");
    
    return leader_clinics;
};
