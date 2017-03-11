'use strict';
module.exports = function(sequelize, DataTypes) {
    var user_logins = sequelize.define('user_logins', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        user_id: DataTypes.UUID,
        user_agent: DataTypes.TEXT,
        ip: DataTypes.STRING,
        status: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                user_logins.belongsTo(models.users)
            }
        }
    });
    return user_logins;
};
