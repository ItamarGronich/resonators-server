'use strict';
module.exports = function(sequelize, DataTypes) {
    var leader_clinics = sequelize.define('leader_clinics', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        clinic_id: DataTypes.UUID,
        leader_id: DataTypes.UUID,
        isPrimary: DataTypes.BOOLEAN,
        isLeaderAccepted: DataTypes.BOOLEAN
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                leader_clinics.belongsTo(models.clinics);
                leader_clinics.belongsTo(models.leaders);
            }
        }
    });

    leader_clinics.removeAttribute('id');
    return leader_clinics;
};