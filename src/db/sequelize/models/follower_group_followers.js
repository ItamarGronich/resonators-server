'use strict';
module.exports = function(sequelize, DataTypes) {
    var follower_group_followers = sequelize.define('follower_group_followers', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        follower_group_id: DataTypes.UUID,
        follower_id: DataTypes.UUID,
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                follower_group_followers.belongsTo(models.followers);
                follower_group_followers.belongsTo(models.follower_groups);
            }
        }
    });

    follower_group_followers.removeAttribute('id');
    return follower_group_followers;
};
