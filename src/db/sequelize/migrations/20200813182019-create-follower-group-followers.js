'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('follower_group_followers', {
      follower_group_id: {
        primaryKey:true,
        type: Sequelize.UUID
      },
      follower_id: {
        primaryKey:true,
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
    return queryInterface.dropTable('follower_group_followers');
  }
};