'use strict';
module.exports = function(sequelize, DataTypes) {
    var resonators_answers = sequelize.define('resonators_answers', {
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
                // associations can be defined here
            }
        }
    });
    return resonators_answers;
};
