'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('leaders', 'default_clinic_id', {type: Sequelize.UUID});
  },

  down: function (queryInterface) {
      return queryInterface.removeColumn('leaders', 'default_clinic_id');
  }
};
