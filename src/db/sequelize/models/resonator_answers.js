'use strict';
module.exports = function(sequelize, DataTypes) {
    var resonator_answers = sequelize.define('resonator_answers', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        resonator_question_id: DataTypes.UUID,
        answer_id: DataTypes.UUID,
        sent_resonator_id: DataTypes.UUID
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                resonator_answers.belongsTo(models.resonator_questions);
            }
        }
    });
    return resonator_answers;
};
