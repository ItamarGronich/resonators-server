'use strict';
module.exports = function(sequelize, DataTypes) {
    var resonator_attachments = sequelize.define('resonator_attachments', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        resonator_id: DataTypes.UUID,
        media_kind: DataTypes.STRING,
        media_format: DataTypes.STRING,
        media_id: DataTypes.STRING,
        title: DataTypes.STRING,
        visible: DataTypes.INTEGER,
        owner_id: DataTypes.UUID,
        owner_role: DataTypes.STRING,
        link: DataTypes.STRING
    }, {
        underscored: true,
        classMethods: {
            associate: function() {
            }
        }
    });
    return resonator_attachments;
};
