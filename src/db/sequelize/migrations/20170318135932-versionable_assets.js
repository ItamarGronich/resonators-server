'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('versionable_assets', 'tag', {
          type: Sequelize.STRING
      })
  },

  down: function (queryInterface) {
      return queryInterface.removeColumn('versionable_assets', 'tag');
  }
};
