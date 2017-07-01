'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('sent_resonators', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      resonator_id: {
        type: Sequelize.UUID
      },
      failed: {
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
        return queryInterface.addIndex('sent_resonators', ['resonator_id']);
    });
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('sent_resonators');
  }
};
