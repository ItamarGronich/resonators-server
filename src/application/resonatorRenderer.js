import resonatorRepository from '../db/repositories/ResonatorRepository';
import LeaderClinicsRepository from '../db/repositories/LeaderClinicsRepository';
import resonatorRenderer from '../scheduler/channels/mail/renderer';
import cfg from '../cfg';

export async function renderResonator(resonatorId) {
    const resonator = await resonatorRepository.findByPk(resonatorId);

    if (!resonator)
        return null;

    const { leader, clinic } = await LeaderClinicsRepository.getLeaderAndClinicByLeaderId(resonator.leader_id);
    const host = cfg.host;

    return resonatorRenderer({resonator, leader, clinic, host, preview: true});
}
