module.exports = {
    up: function (queryInterface, Sequelize) {
      return queryInterface.createTable('leader_clinics', {
        leader_id: {
            type: Sequelize.UUID,
            primaryKey:true
        },
        clinic_id: {
            type: Sequelize.UUID,
            primaryKey:true
        },
        is_primary: {
            type: Sequelize.BOOLEAN
        },
        is_leader_accepted: {
            type: Sequelize.BOOLEAN
        },
        created_at: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE
        }
    });
    },
  
    down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('leader_clinics');
    }
  };