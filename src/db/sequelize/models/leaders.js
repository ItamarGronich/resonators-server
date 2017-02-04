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
        visible: DataTypes.INTEGER
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                leaders.belongsTo(models.users);
            }
        }
    });
    return leaders;
};
