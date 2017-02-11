'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('answers', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            question_id: {
                type: Sequelize.UUID
            },
            body: {
                type: Sequelize.STRING
            },
            rank: {
                type: Sequelize.INTEGER
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
        return queryInterface.dropTable('answers');
    }
};
