'use strict';
module.exports = function(sequelize, DataTypes) {
    var leader_calendars = sequelize.define('leader_calendars', {
        leader_id: DataTypes.UUID,
        calendar_id: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                leader_calendars.belongsTo(models.leaders);
            }
        }
    });
    return leader_calendars;
};
