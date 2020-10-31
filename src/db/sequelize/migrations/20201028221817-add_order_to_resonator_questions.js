'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return queryInterface.addColumn('resonator_questions', 'order', { type: Sequelize.INTEGER });
  },

  down: async (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('resonator_questions', 'order');
  }
};
