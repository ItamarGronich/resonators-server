import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {users, leaders} from '../sequelize/models';

class LeaderRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(leader) {
        return {
            ...leader
        };
    }

    async save(leader, transaction, lastLeader) {
        return await leaders.create(leader, {transaction});
    }
}

export default new LeaderRepository();
