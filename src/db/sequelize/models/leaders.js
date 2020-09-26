"use strict";
module.exports = (sequelize, DataTypes) => {
    const leaders = sequelize.define(
        "leaders",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            user_id: DataTypes.UUID,
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            current_clinic_id: DataTypes.UUID,
            visible: DataTypes.INTEGER,
            group_permissions: DataTypes.BOOLEAN,
        },
        { underscored: true }
    );

    leaders.associate = (models) => {
        leaders.belongsTo(models.users);
        leaders.hasMany(models.followers);
        leaders.hasMany(models.follower_groups);
    };

    return leaders;
};
