import uuid from 'uuid/v4';
import {followers} from '../../src/db/sequelize/models';
import {barUser} from './users';
import {fooLeader} from './leaders';
import {clinic} from './clinics';

export default () => {
    return followers.create(barFollower);
};

export const barFollower = {
    id: '37d097a3-5397-4424-bdfb-0aebed7bafaa',
    user_id: barUser.id,
    leader_id: fooLeader.id,
    clinic_id: clinic.id,
    status: 1
};
