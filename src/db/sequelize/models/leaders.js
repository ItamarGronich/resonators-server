'use strict';
module.exports = function(sequelize, DataTypes) {
    var leaders = sequelize.define('leaders', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        user_id: DataTypes.UUID,
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        current_clinic_id: DataTypes.UUID,
        visible: DataTypes.INTEGER,
        group_permissions: DataTypes.BOOLEAN,
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                leaders.belongsTo(models.users);
                leaders.hasMany(models.followers);
            }
        }
    });
    return leaders;
};
