import resonatorsRepository from "../../db/repositories/ResonatorRepository.js";

export default async function enforceFollowerResonator(request, response) {
    const follower = request.appSession.follower;
    const resonatorId = require.params.resonatorId;

    const resonator = await resonatorsRepository.findById(resonatorId);
    const match = resonator && resonator.follower_id === follower.id;

    if (!match) {
        response.status(404).json({
            status: `This follower has no resonator ${resonatorId}`,
        });
    }

    return match;
}
