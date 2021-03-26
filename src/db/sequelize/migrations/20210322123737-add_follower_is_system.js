'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('followers', 'is_system', { type: Sequelize.BOOLEAN, defaultValue: false });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('followers', 'is_system');
  },
};
