'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('leaders', 'clinic_gdrive', { type: Sequelize.BOOLEAN, defaultValue: false });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('leaders', 'clinic_gdrive');
  },
};
