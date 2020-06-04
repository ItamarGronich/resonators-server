'use strict';
module.exports = function(sequelize, DataTypes) {
    var google_accounts = sequelize.define('google_accounts', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        id_token: DataTypes.STRING,
        access_token: DataTypes.STRING,
        refresh_token: DataTypes.STRING,
        access_token_expiry_date: DataTypes.DATE,
        user_id: DataTypes.UUID,
        google_email: DataTypes.STRING
    }, {
        classMethods: {
            associate: function() {
                // associations can be defined here
            }
        }
    });
    return google_accounts;
};
