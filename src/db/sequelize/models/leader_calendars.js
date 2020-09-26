"use strict";
module.exports = (sequelize, DataTypes) => {
    const leader_calendars = sequelize.define(
        "leader_calendars",
        {
            leader_id: DataTypes.UUID,
            calendar_id: { type: DataTypes.STRING, primaryKey: true },
        },
        { underscored: true }
    );

    leader_calendars.associate = (models) => {
        leader_calendars.belongsTo(models.leaders);
    };

    return leader_calendars;
};
