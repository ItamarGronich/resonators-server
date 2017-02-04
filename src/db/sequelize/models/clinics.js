'use strict';
module.exports = function(sequelize, DataTypes) {
    var clinics = sequelize.define('clinics', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        user_id: DataTypes.UUID,
        name: DataTypes.STRING
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                clinics.belongsTo(models.users);
            }
        }
    });
    return clinics;
};
