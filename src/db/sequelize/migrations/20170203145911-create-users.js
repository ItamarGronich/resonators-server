'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      pass: {
        type: Sequelize.STRING
      },
      salt: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      unsubscribed: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        type: Sequelize.BIGINT
      },
      updated_at: {
        type: Sequelize.BIGINT
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
    return queryInterface.dropTable('users');
  }
};
