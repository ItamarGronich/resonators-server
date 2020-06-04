'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('resonators', 'one_off', { type: Sequelize.BOOLEAN }),
      queryInterface.addColumn('resonators', 'interaction_type', { type: Sequelize.INTEGER }),
      queryInterface.addColumn('resonators', 'selected_questionnaire', { type: Sequelize.TEXT }),
      queryInterface.addColumn('resonators', 'questionnaire_details', { type: Sequelize.TEXT })

    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('resonators', 'one_off'),
      queryInterface.removeColumn('resonators', 'interaction_type'),
      queryInterface.removeColumn('resonators', 'selected_questionnaire'),
      queryInterface.removeColumn('resonators', 'questionnaire_details')
    ]);
  }
};

