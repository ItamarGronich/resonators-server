'use strict';
module.exports = function(sequelize, DataTypes) {
    var resonators = sequelize.define('resonators', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        leader_id: DataTypes.UUID,
        title: DataTypes.STRING,
        link: DataTypes.STRING,
        description: DataTypes.STRING,
        content: DataTypes.STRING,
        follower_id: DataTypes.UUID,
        pop_email: DataTypes.BOOLEAN,
        pop_location_lat: DataTypes.DOUBLE,
        pop_location_lng: DataTypes.DOUBLE,
        pop_time: DataTypes.DATE,
        repeat_days: DataTypes.STRING,
        last_pop_time: DataTypes.DATE,
        disable_copy_to_leader: DataTypes.BOOLEAN,
        one_off: DataTypes.BOOLEAN,
        interaction_type: DataTypes.INTEGER,
        selected_questionnaire: DataTypes.STRING,
        questionnaire_details: DataTypes.STRING
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                resonators.hasMany(models.resonator_attachments);
                resonators.hasMany(models.resonator_questions);
                resonators.belongsTo(models.followers);
                resonators.belongsTo(models.leaders);
            }
        }
    });
    return resonators;
};
