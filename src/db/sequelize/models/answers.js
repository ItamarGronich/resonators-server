'use strict';
module.exports = function(sequelize, DataTypes) {
    var answers = sequelize.define('answers', {
        id:{
            type: DataTypes.UUID,
            primaryKey: true
        },
        question_id: DataTypes.UUID,
        body: DataTypes.STRING,
        rank: DataTypes.INTEGER
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return answers;
};
