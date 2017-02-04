import uuid from 'uuid/v4';
import {clinics} from '../../src/db/sequelize/models';
import {fooUser} from './users';

export default () => {
    return clinics.create(clinic);
};

export const clinic = {
    id: uuid(),
    user_id: fooUser.id,
    name: 'Foo\'s clinic'
};
