'use strict';
module.exports = function(sequelize, DataTypes) {
  var sent_resonators = sequelize.define('sent_resonators', {
      id: {
          type: DataTypes.UUID,
          primaryKey: true
      },
      resonator_id: DataTypes.UUID,
      failed: DataTypes.BOOLEAN,
      expiry_date: DataTypes.DATE,
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
          sent_resonators.belongsTo(models.resonators);
          sent_resonators.hasMany(models.resonator_answers);
      }
    }
  });
  return sent_resonators;
};
