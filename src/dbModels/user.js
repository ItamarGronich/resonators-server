import Sequelize from 'sequelize';
import conn from '../dbConnection';

export default conn.define('users', {
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },

    email: {
        type: Sequelize.STRING,
        field: 'email'
    },

    pass: {
        type: Sequelize.STRING,
        field: 'pass'
    },

    salt: {
        type: Sequelize.STRING,
        field: 'salt'
    },

    country: {
        type: Sequelize.STRING,
        field: 'country'
    },

    unsubscribed: {
        type: Sequelize.BOOLEAN,
        field: 'unsubscribed'
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
