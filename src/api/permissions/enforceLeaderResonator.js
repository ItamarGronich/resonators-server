import resonatorsRepository from '../../db/repositories/ResonatorRepository.js';

export default async function enforceLeaderResonator(request, response) {
    const leader = request.appSession.leader || {};
    const resonatorId = request.params.resonatorId || request.params.reminderId;
    const resonator = await resonatorsRepository.findById(resonatorId);

    if (resonator.leader_id !== leader.id) {
        response.status(403);
        response.json({ status: 'leader is not permitted to view or edit the given resonator.'});
        return false;
    } else
        return true;
}
