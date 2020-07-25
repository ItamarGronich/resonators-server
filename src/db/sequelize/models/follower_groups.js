'use strict';
module.exports = function(sequelize, DataTypes) {
    var followers_groups = sequelize.define('follower_groups', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        group_name: DataTypes.STRING,
        leader_id: DataTypes.UUID,
        clinic_id: DataTypes.UUID,
        status: DataTypes.INTEGER,
        frozen: DataTypes.BOOLEAN
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                followers_groups.belongsTo(models.leaders);
                followers_groups.belongsTo(models.clinics);
                followers_groups.hasMany(models.resonators);
                followers_groups.hasMany(models.follower_group_followers);
            }
        }
    });
    return followers_groups;
};
