import resonatorRepository from '../db/repositories/ResonatorRepository';
import resonatorRenderer from '../emailRenderer';

export async function renderResonator(resonatorId) {
    const resonator = await resonatorRepository.findById(resonatorId);

    if (!resonator)
        return null;

    return resonatorRenderer(resonator);
}
