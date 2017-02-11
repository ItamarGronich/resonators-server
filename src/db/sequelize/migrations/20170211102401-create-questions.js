'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('questions', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            leader_id: {
                type: Sequelize.UUID
            },
            question_kind: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            title: {
                type: Sequelize.STRING
            },
            removed: {
                type: Sequelize.BOOLEAN
            },
            clinic_id: {
                type: Sequelize.UUID
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('questions');
    }
};
