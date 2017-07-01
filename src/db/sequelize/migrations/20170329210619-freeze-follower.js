'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('followers', 'frozen', {type: Sequelize.BOOLEAN});
  },

  down: function (queryInterface) {
      return queryInterface.removeColumn('followers', 'frozen');
  }
};
