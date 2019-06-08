'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('leaders', 'default_clinic_id','current_clinic_id');
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('leaders', 'current_clinic_id','default_clinic_id');
  }
};