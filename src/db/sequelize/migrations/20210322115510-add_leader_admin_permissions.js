'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('leaders', 'admin_permissions', { type: Sequelize.BOOLEAN, defaultValue: false });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('leaders', 'admin_permissions');
  },
};
