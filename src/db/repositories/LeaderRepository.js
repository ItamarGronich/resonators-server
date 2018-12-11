import Repository from './Repository';
import {leaders} from '../sequelize/models';
import * as dbToDomain from '../dbToDomain';

class LeaderRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(leader) {
        return {
            ...leader
        };
    }

    save(leader, transaction) {
        return leaders.create(leader, {transaction});
    }
    async findById(id) {
        const row = await leaders.findById(id);

        if (!row)
            return null;

        const leader = dbToDomain.toLeader(row);

        this.trackEntity(leader);

        return leader;
    }

}

export default new LeaderRepository();
