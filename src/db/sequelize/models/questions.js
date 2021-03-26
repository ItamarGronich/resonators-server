"use strict";
module.exports = (sequelize, DataTypes) => {
    const questions = sequelize.define(
        "questions",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            leader_id: DataTypes.UUID,
            question_kind: DataTypes.STRING,
            description: DataTypes.STRING,
            tags: DataTypes.STRING,
            is_system: DataTypes.BOOLEAN,
            title: DataTypes.STRING,
            removed: DataTypes.BOOLEAN,
            clinic_id: DataTypes.UUID,
        },
        { underscored: true }
    );

    questions.associate = (models) => {
        questions.hasMany(models.answers);
        questions.belongsTo(models.clinics);
    };

    return questions;
};
