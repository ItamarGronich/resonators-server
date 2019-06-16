import Repository from './Repository';
import {leader_clinics} from '../sequelize/models';
import * as dbToDomain from '../dbToDomain';

class LeaderClinicsRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(leaderClinic) {
        return {
            ...leaderClinic
        };
    }

    save(leaderClinic, transaction) {
        return leader_clinics.create(leaderClinic, {transaction});
    }   
}

export default new LeaderClinicsRepository();
