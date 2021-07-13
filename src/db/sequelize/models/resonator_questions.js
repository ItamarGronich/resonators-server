"use strict";
module.exports = (sequelize, DataTypes) => {
    const resonator_questions = sequelize.define(
        "resonator_questions",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            question_id: DataTypes.UUID,
            resonator_id: DataTypes.UUID,
            removed: DataTypes.BOOLEAN,
            order: DataTypes.INTEGER
        },
        { underscored: true }
    );

    resonator_questions.associate = (models) => {
        resonator_questions.belongsTo(models.questions);
        resonator_questions.belongsTo(models.resonators);
        resonator_questions.hasMany(models.resonator_answers);
    };

    return resonator_questions;
};
