'use strict';
module.exports = function(sequelize, DataTypes) {
    var versionableAssets = sequelize.define('versionable_assets', {
        id: {
            type:DataTypes.UUID,
            primaryKey: true
        },
        asset_id: DataTypes.STRING,
        asset_version: DataTypes.INTEGER,
        link: DataTypes.STRING,
        tag: DataTypes.STRING
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return versionableAssets;
};
