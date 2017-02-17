import {resonators as resonatorsDb} from '../db/sequelize/models';
import Resonator from '../domain/entities/resonator';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import questionRepository from '../db/repositories/QuestionRepository';
import * as dtoFactory from './dto/index';
import updatePermittedFields from './updatePermittedFields';
import getUow from './getUow';

export async function getResonators(followerId) {
    const resonators = await resonatorRepository.findByFollowerId(followerId);
    const resonatorsDto = resonators.map(dtoFactory.toResonator);
    return resonatorsDto;
}

export async function getResonator(reminderId) {
    const resonator = await resonatorRepository.findById(reminderId);
    const dto = dtoFactory.toResonator(resonator);
    return dto;
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

export async function addQuestionToResonator(resonator_id, question_id) {
    const [resonator, question] = await Promise.all([
        resonatorRepository.findById(resonator_id),
        questionRepository.findById(question_id)
    ]);

    if (!resonator || !question)
        return null;

    resonator.addQuestion(question_id);

    await getUow().commit();
    return true;
}

export async function removeQuestionFromResonator(resonator_id, question_id) {
    const resonator = await resonatorRepository.findById(resonator_id);

    if (!resonator)
        return null;

    resonator.removeQuestion(question_id);

    await getUow().commit();

    return true;
}
