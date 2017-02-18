import resonatorRepository from '../db/repositories/ResonatorRepository';
import resonatorRenderer from '../emailRenderer';
import cfg from '../cfg';

export async function renderResonator(resonatorId) {
    const resonator = await resonatorRepository.findById(resonatorId);

    if (!resonator)
        return null;

    const host = cfg.secrets.host;

    return resonatorRenderer(resonator, host);
}
