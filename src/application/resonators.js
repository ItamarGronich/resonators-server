import {resonators as resonatorsDb} from '../db/sequelize/models';
import Resonator from '../domain/entities/resonator';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import * as dtoFactory from './dto/index';
import updatePermittedFields from './updatePermittedFields';
import getUow from './getUow';

export async function getResonators(followerId) {
    const resonators = await resonatorRepository.findByFollowerId(followerId);
    const resonatorsDto = resonators.map(dtoFactory.toResonator);
    return resonatorsDto;
}

export async function createResonator(leader_id, resonatorRequest) {
    const uow = getUow();
    const resonator = new Resonator({
        ...resonatorRequest,
        leader_id
    });

    uow.trackEntity(resonator, {isNew: true});
    await uow.commit();

    const savedResonator = dtoFactory.toResonator(await resonatorRepository.findById(resonator.id));
    return savedResonator;
}

export async function updateResonator(resonator_id, updatedFields) {
    const resonator = await resonatorRepository.findById(resonator_id);

    if (!resonator)
        return null;

    updatePermittedFields(resonator, updatedFields, [
        'title', 'link', 'description', 'content', 'repeat_days', 'disable_copy_to_leader'
    ]);

    getUow().commit();

    const savedResonator = dtoFactory.toResonator(await resonatorRepository.findById(resonator_id));
    return savedResonator;
}
