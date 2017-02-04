import uuid from 'uuid/v4';
import {clinics} from '../../src/db/sequelize/models';
import {fooUser} from './users';

export default () => {
    return clinics.create(clinic);
};

export const clinic = {
    id: '0a2f1d72-0b4b-4a21-9873-bae07a2ea3e3',
    user_id: fooUser.id,
    name: 'Foo\'s clinic'
};
