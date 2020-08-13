'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('leaders', 'group_permissions', { type: Sequelize.BOOLEAN });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('leaders', 'group_permissions');
  },
};
