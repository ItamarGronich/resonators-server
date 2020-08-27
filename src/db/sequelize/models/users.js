'use strict';
module.exports = function(sequelize, DataTypes) {
    var users = sequelize.define('users', {
        id: {
            type:DataTypes.UUID,
            primaryKey: true
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        pass: DataTypes.STRING,
        salt: DataTypes.STRING,
        country: DataTypes.STRING,
        unsubscribed: DataTypes.BOOLEAN,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                users.hasOne(models.leaders);
                users.hasOne(models.followers);
                users.hasOne(models.user_password_resets);
                users.hasMany(models.push_subscriptions);
            }
        }
    });
    return users;
};
