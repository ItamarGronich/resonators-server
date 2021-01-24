'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sent_resonators', 'read', { type: Sequelize.BOOLEAN, defaultValue: true });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('sent_resonators', 'read');
  }
};
