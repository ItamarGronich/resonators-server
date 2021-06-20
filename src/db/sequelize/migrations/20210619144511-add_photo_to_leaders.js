'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('leaders', 'photo', { type: Sequelize.STRING });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('leaders', 'photo');
  },
};
