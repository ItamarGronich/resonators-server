import uuid from 'uuid/v4';
import {leaders} from '../../src/db/sequelize/models';
import {fooUser} from './users';

export default () => {
    return leaders.create(fooLeader);
};

export const fooLeader = {
    id: '076123b9-4d90-4272-8f64-23c2d1de9057',
    user_id: fooUser.id,
    title: 'A fearless leader',
    description: 'Terra is my nation',
    visible: 1
};
