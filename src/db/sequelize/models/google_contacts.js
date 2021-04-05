"use strict";
module.exports = (sequelize, DataTypes) => {
    const google_contacts = sequelize.define(
        "google_contacts",
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            user_id: DataTypes.UUID,
            name: DataTypes.STRING,
            email: DataTypes.STRING,
        },
        { underscored: true, timestamps: false }
    );

    return google_contacts;
};
