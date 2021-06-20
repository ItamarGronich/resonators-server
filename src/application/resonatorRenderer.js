import resonatorRepository from '../db/repositories/ResonatorRepository';
import resonatorRenderer from '../scheduler/channels/mail/renderer';
import cfg from '../cfg';
import {leaders, clinics, users} from '../db/sequelize/models';

export async function renderResonator(resonatorId) {
    const resonator = await resonatorRepository.findByPk(resonatorId);
    const leader = await leaders.findOne({
        where: {id: resonator.leader_id},
        include: [users]
    });
    const clinic = await clinics.findOne({where: {id: leader.current_clinic_id}});

    if (!resonator)
        return null;

    const host = cfg.host;

    return resonatorRenderer({resonator, leader, clinic, host, preview: true});
}
