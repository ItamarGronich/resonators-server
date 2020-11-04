'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return queryInterface.sequelize.query("ALTER TABLE resonator_answers ADD CONSTRAINT resonator_answers_resonator_question_id_fkey FOREIGN KEY (resonator_question_id) REFERENCES resonator_questions (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;")
  },

  down: async (queryInterface, Sequelize) => {
      return queryInterface.sequelize.query("ALTER TABLE resonator_answers DROP INDEX resonator_answers_resonator_question_id_fkey;")
  }
};
