import {user_logins} from '../../src/db/sequelize/models';
import {fooUser} from './users';

export default () => {
    return user_logins.create(fooUserLogin);
};

export const fooUserLogin = {
    id: '33f9a853-4719-4685-af68-4341b90ffb4b',
    user_id: fooUser.id
};
