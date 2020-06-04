'use strict';
module.exports = function(sequelize, DataTypes) {
    var user_password_resets = sequelize.define('user_password_resets', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        user_id: DataTypes.UUID
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                user_password_resets.belongsTo(models.users);
            }
        }
    });
    return user_password_resets;
};
