'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('follower_groups', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      group_name: {
        type: Sequelize.STRING
      },
      leader_id: {
        type: Sequelize.UUID
      },
      clinic_id: {
        type: Sequelize.UUID
      },
      status: {
        type: Sequelize.INTEGER
      },
      frozen: {
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
    return queryInterface.dropTable('follower_groups');
  }
};