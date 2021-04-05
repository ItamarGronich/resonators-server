"use strict";
module.exports = (sequelize, DataTypes) => {
    const google_photos = sequelize.define(
        "google_photos",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            user_id: DataTypes.UUID,
            image: DataTypes.STRING,
            description: DataTypes.TEXT,
            file_id: DataTypes.STRING
        },
        { underscored: true, timestamps: false }
    );

    return google_photos;
};
