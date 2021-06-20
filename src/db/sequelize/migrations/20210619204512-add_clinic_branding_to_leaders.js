'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('leaders', 'clinic_branding', { type: Sequelize.BOOLEAN, defaultValue: true });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('leaders', 'clinic_branding');
  },
};
