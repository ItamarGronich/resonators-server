'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('resonators', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      leader_id: {
        type: Sequelize.UUID
      },
      title: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      follower_id: {
        type: Sequelize.UUID
      },
      pop_email: {
        type: Sequelize.BOOLEAN
      },
      pop_location_lat: {
        type: Sequelize.DOUBLE
      },
      pop_location_lng: {
        type: Sequelize.DOUBLE
      },
      pop_time: {
        type: Sequelize.DATE
      },
      repeat_days: {
        type: Sequelize.STRING
      },
      last_pop_time: {
        type: Sequelize.DATE
      },
      disable_copy_to_leader: {
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
    }).then(function() {
        return queryInterface.addIndex('resonators', ['follower_id']);
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('resonators');
  }
};
