import resonatorRepository from '../db/repositories/ResonatorRepository';
import resonatorRenderer from '../scheduler/channels/mail/renderer';
import cfg from '../cfg';

export async function renderResonator(resonatorId) {
    const resonator = await resonatorRepository.findByPk(resonatorId);

    if (!resonator)
        return null;

    const host = cfg.host;

    return resonatorRenderer({resonator, host, preview: true});
}
