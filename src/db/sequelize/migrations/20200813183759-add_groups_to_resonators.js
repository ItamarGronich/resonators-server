'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('resonators', 'follower_group_id', { type: Sequelize.UUID }),
      queryInterface.addColumn('resonators', 'parent_resonator_id', { type: Sequelize.UUID }),
      queryInterface.addColumn('resonators', 'ttl_policy', { type: Sequelize.INTEGER }),
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('resonators', 'follower_group_id'),
      queryInterface.removeColumn('resonators', 'parent_resonator_id'),
      queryInterface.removeColumn('resonators', 'ttl_policy'),
    ]);
  }
};
