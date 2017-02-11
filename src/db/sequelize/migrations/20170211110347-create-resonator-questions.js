'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('resonator_questions', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            question_id: {
                type: Sequelize.UUID
            },
            resonator_id: {
                type: Sequelize.UUID
            },
            removed: {
                type: Sequelize.BOOLEAN
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
        return queryInterface.dropTable('resonator_questions');
    }
};
