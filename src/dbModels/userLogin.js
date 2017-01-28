import Sequelize from 'sequelize';
import conn from '../dbConnection';

export default conn.define('user_logins', {
    userId: {
        type: Sequelize.STRING,
        field: 'user_id'
    },

    userAgen: {
        type: Sequelize.STRING,
        field: 'user_agent'
    },

    ip: {
        type: Sequelize.STRING,
        field: 'ip'
    },

    status: {
        type: Sequelize.INTEGER,
        field: 'status'
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
