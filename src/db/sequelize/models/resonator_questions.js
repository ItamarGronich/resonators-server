'use strict';
module.exports = function(sequelize, DataTypes) {
    var resonator_questions = sequelize.define('resonator_questions', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        question_id: DataTypes.UUID,
        resonator_id: DataTypes.UUID,
        removed: DataTypes.BOOLEAN
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                resonator_questions.hasMany(models.questions);
            }
        }
    });
    return resonator_questions;
};
