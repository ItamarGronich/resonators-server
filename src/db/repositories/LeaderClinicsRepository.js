import Repository from './Repository';
import {clinics, leader_clinics, leaders, users} from '../sequelize/models';
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

    async getLeaderAndClinicByLeaderId(leaderId) {
        const leader = await leaders.findOne({
            where: {id: leaderId},
            include: [users]
        });
        const clinic = await clinics.findOne({where: {id: leader.current_clinic_id}});

        return {leader, clinic};
    }
}

export default new LeaderClinicsRepository();
