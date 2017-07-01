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
                type: Sequelize.TEXT
            },
            title: {
                type: Sequelize.TEXT
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
        }).then(function() {
            return Promise.all([
                queryInterface.addIndex('questions', ['clinic_id']),
                queryInterface.addIndex('questions', ['leader_id']),
            ]);
        });
    },
    down: function(queryInterface) {
        return queryInterface.dropTable('questions');
    }
};
