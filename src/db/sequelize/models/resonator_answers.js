"use strict";
module.exports = (sequelize, DataTypes) => {
    const resonator_answers = sequelize.define(
        "resonator_answers",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            resonator_question_id: DataTypes.UUID,
            answer_id: DataTypes.UUID,
            sent_resonator_id: DataTypes.UUID,
        },
        { underscored: true }
    );

    resonator_answers.associate = (models) => {
        resonator_answers.belongsTo(models.resonator_questions);
        resonator_answers.belongsTo(models.answers);
    };
    
    return resonator_answers;
};
