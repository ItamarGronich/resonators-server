import resonatorStatsRepository from '../db/repositories/ResonatorStatsRepository';

export async function getResonatorStats(resonatorId) {
    return await resonatorStatsRepository.findById(resonatorId);
}
