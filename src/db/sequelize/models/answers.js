"use strict";
module.exports = (sequelize, DataTypes) =>
    sequelize.define(
        "answers",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            question_id: DataTypes.UUID,
            body: DataTypes.STRING,
            rank: DataTypes.INTEGER,
        },
        { underscored: true }
    );
