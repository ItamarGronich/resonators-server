'use strict';
module.exports = function(sequelize, DataTypes) {
    var followers = sequelize.define('followers', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        user_id: DataTypes.UUID,
        leader_id: DataTypes.UUID,
        clinic_id: DataTypes.UUID,
        status: DataTypes.INTEGER
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                followers.belongsTo(models.users);
            }
        }
    });
    return followers;
};
