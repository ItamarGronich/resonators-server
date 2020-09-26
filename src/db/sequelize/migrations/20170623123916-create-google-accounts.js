'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('google_accounts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            id_token: {
                type: Sequelize.TEXT
            },
            access_token: {
                type: Sequelize.TEXT
            },
            refresh_token: {
                type: Sequelize.TEXT
            },
            access_token_expiry_date: {
                type: Sequelize.DATE
            },
            user_id: {
                type: Sequelize.UUID
            },
            google_email: {
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
            return Promise.all([
                queryInterface.addIndex('google_accounts', ['user_id']),
            ]);
        });
    },
    down: function(queryInterface) {
        return queryInterface.dropTable('google_accounts');
    }
};
