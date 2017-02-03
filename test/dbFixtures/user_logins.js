import {user_logins} from '../../src/db/sequelize/models';

export default () => {
    return user_logins.sync({force: true});
};
