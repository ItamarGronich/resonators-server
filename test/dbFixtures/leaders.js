import uuid from 'uuid/v4';
import {leaders} from '../../src/db/sequelize/models';
import {fooUser} from './users';

export default () => {
    return leaders.create(fooLeader);
};

export const fooLeader = {
    id: uuid(),
    user_id: fooUser.id,
    title: 'A fearless leader',
    description: 'Terra is my nation',
    visible: 1
};
