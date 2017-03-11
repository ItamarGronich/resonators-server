'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('resonator_attachments', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            resonator_id: {
                type: Sequelize.UUID
            },
            media_kind: {
                type: Sequelize.STRING
            },
            media_format: {
                type: Sequelize.STRING
            },
            media_id: {
                type: Sequelize.STRING
            },
            title: {
                type: Sequelize.STRING
            },
            visible: {
                type: Sequelize.INTEGER
            },
            owner_id: {
                type: Sequelize.UUID
            },
            owner_role: {
                type: Sequelize.STRING
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
            return queryInterface.addIndex('resonator_attachments', ['resonator_id']);
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('resonator_attachments');
    }
};
