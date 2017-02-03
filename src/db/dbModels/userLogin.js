import Sequelize from 'sequelize';
import conn from '../dbConnection';
import User from './user';

const UserLogin = conn.define('user_logins', {
    id: {
        type: Sequelize.UUID,
        field: 'id',
        primaryKey: true
    },

    userId: {
        type: Sequelize.UUID,
        field: 'user_id'
    },

    userAgent: {
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
    updatedAt: false
});

UserLogin.belongsTo(User, { through: 'user_id'});

export default UserLogin;
