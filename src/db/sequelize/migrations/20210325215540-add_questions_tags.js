'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('questions', 'tags', { type: Sequelize.TEXT });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('questions', 'tags');
  },
};
