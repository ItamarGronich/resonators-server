import { v4 as uuid } from "uuid";
import {followers} from '../../src/db/sequelize/models';
import {barUser, putUser} from './users';
import {fooLeader, bazLeader} from './leaders';
import {clinic} from './clinics';

export default () => {
    return Promise.all([
        followers.create(barFollower),
        followers.create(putFollower)
    ]);
};

export const barFollower = {
    id: '37d097a3-5397-4424-bdfb-0aebed7bafaa',
    user_id: barUser.id,
    leader_id: fooLeader.id,
    clinic_id: clinic.id,
    status: 1
};

export const putFollower = {
    id: '82e2e63f-7983-4e85-a374-dbead0a0b1f6',
    user_id: putUser.id,
    leader_id: bazLeader.id,
    clinic_id: clinic.id,
    status: 1
}
