'use strict';
module.exports = function(sequelize, DataTypes) {
  var resonator_answers = sequelize.define('resonator_answers', {
    resonator_question_id: DataTypes.UUID,
    answer_id: DataTypes.UUID,
    sent_resonator_id: DataTypes.UUID
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return resonator_answers;
};