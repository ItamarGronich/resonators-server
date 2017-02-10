import {user_logins} from '../../src/db/sequelize/models';
import {fooUser, bazUser} from './users';

export default () => {
    return Promise.all([
        user_logins.create(fooUserLogin),
        user_logins.create(bazUserLogin)
    ]);
};

export const fooUserLogin = {
    id: '33f9a853-4719-4685-af68-4341b90ffb4b',
    user_id: fooUser.id
};

export const bazUserLogin = {
    id: 'bdb88789-260b-43d0-853c-7ec37349f544',
    user_id: bazUser.id
};
