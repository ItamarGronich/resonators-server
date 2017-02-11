'use strict';
module.exports = function(sequelize, DataTypes) {
    var questions = sequelize.define('questions', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        leader_id: DataTypes.UUID,
        question_kind: DataTypes.STRING,
        description: DataTypes.STRING,
        title: DataTypes.STRING,
        removed: DataTypes.BOOLEAN,
        clinic_id: DataTypes.UUID
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                questions.hasMany(models.answers);
            }
        }
    });
    return questions;
};
