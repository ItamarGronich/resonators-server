'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('clinics', 'website', { type: Sequelize.STRING });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('clinics', 'website');
  },
};
