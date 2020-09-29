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
        return leaders.upsert(leader, {transaction});
    }

    async findByUserId(userId) {
        const row = await leaders.findOne({
            where: {user_id: userId},
        });
    
        if (!row)
            return null;
    
        const leader = dbToDomain.toLeader(row);

        this.trackEntity(leader);

        return leader;
    }

    async findByPk(id) {
        const row = await leaders.findByPk(id);

        if (!row)
            return null;

        const leader = dbToDomain.toLeader(row);

        this.trackEntity(leader);

        return leader;
    }

}

export default new LeaderRepository();
