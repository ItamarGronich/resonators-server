'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('versionable_assets', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            asset_id: {
                type: Sequelize.STRING
            },
            asset_version: {
                type: Sequelize.INTEGER
            },
            link: {
                type: Sequelize.STRING
            },
            created_at: {
              allowNull: false,
              type: Sequelize.DATE
            },
            updated_at: {
              allowNull: false,
              type: Sequelize.DATE
            }
        }).then(function() {
            // return queryInterface.addIndex('versionable_assets', ['asset_id', 'created_at']);
        });
    },
    down: function(queryInterface) {
        return queryInterface.dropTable('versionable_assets');
    }
};
