'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('resonator_answers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            resonator_question_id: {
                type: Sequelize.UUID
            },
            answer_id: {
                type: Sequelize.UUID
            },
            sent_resonator_id: {
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
            return queryInterface.addIndex('resonator_answers', ['resonator_question_id']);
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('resonator_answers');
    }
};
