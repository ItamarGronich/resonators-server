"use strict";
module.exports = (sequelize, DataTypes) => {
    const follower_group_followers = sequelize.define(
        "follower_group_followers",
        {
            follower_group_id: { type: DataTypes.UUID, primaryKey: true },
            follower_id: { type: DataTypes.UUID, primaryKey: true },
        },
        { underscored: true }
    );

    follower_group_followers.associate = (models) => {
        follower_group_followers.belongsTo(models.followers);
        follower_group_followers.belongsTo(models.follower_groups);
    };

    follower_group_followers.removeAttribute("id");

    return follower_group_followers;
};
