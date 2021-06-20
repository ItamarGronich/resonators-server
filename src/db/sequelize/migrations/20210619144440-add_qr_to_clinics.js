'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('clinics', 'qr', { type: Sequelize.STRING });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('clinics', 'qr');
  },
};
