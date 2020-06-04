import uuid from 'uuid/v4';
import {leaders} from '../../src/db/sequelize/models';
import {fooUser, bazUser} from './users';

export default () => {
    return Promise.all([
        leaders.create(fooLeader),
        leaders.create(bazLeader)
    ]);
};

export const fooLeader = {
    id: '076123b9-4d90-4272-8f64-23c2d1de9057',
    user_id: fooUser.id,
    title: 'A fearless leader',
    description: 'Terra is my nation',
    visible: 1
};

export const bazLeader = {
    id: 'ed6d0d97-64f3-463e-b04e-75b930b4b7ca',
    user_id: bazUser.id,
    title: 'bazzzz',
    description: 'To infinity and beyond?',
    visible: 1
};
