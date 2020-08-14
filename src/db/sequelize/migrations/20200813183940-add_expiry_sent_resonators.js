'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('sent_resonators', 'expiry_date', { type: Sequelize.DATE });

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('sent_resonators', 'expiry_date');
  }
};
