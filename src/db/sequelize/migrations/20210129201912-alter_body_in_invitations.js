'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('invitations', 'body', { type: Sequelize.TEXT });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('invitations', 'body', { type: Sequelize.STRING });
  }
};
