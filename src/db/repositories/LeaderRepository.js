import Repository from './Repository';
import {leaders} from '../sequelize/models';

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
}

export default new LeaderRepository();
