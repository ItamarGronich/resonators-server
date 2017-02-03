'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('user_logins', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      id: {
        type: Sequelize.UUID
      },
      user_id: {
        type: Sequelize.UUID
      },
      user_agent: {
        type: Sequelize.STRING
      },
      ip: {
        type: Sequelize.STRING
      },
      status: {
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
    }).then(function() {
        return queryInterface.addIndex('user_logins', ['user_id'])
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('user_logins');
  }
};
