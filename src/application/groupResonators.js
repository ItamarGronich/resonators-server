import Resonator from '../domain/entities/resonator';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import questionRepository from '../db/repositories/QuestionRepository';
import * as dtoFactory from './dto/index';
import updatePermittedFields from './updatePermittedFields';
import s3 from '../s3';
import getUow from './getUow';
import uuid from 'uuid/v4';

// TODO: Have all functions run on all child resonators

export const getGroupResonators = async (followerGroupId) => {
    const resonators = await resonatorRepository.findByFollowerGroupId(followerGroupId);
    const resonatorsDto = resonators.map(dtoFactory.toResonator);
    return resonatorsDto;
}

export const getChildResonators = async (reminderId) => {
    const resonators = await resonatorRepository.findChildrenById(reminderId);
    const resonatorsDto = resonators.map(dtoFactory.toResonator);
    return resonatorsDto;
}

export const getGroupResonator = async (reminderId) => {
    const resonator = await resonatorRepository.findById(reminderId);
    const dto = dtoFactory.toResonator(resonator);
    return dto;
}

export const createGroupResonator = async (leader_id, resonatorRequest) => {
    const uow = getUow();
    const resonator = new Resonator({
        ...resonatorRequest,
        leader_id
    });

    uow.trackEntity(resonator, { isNew: true });
    await uow.commit();

    const savedResonator = dtoFactory.toResonator(await resonatorRepository.findById(resonator.id));
    return savedResonator;
}

export const updateGroupResonator = async (resonator_id, updatedFields) => {
    const resonator = await resonatorRepository.findById(resonator_id);

    if (!resonator)
        return null;

    updatePermittedFields(resonator, updatedFields, [
        'title', 'link', 'description', 'content', 'repeat_days', 'disable_copy_to_leader', 'pop_email', 'pop_time',
        'one_off', 'interaction_type', 'selected_questionnaire', 'questionnaire_details'
    ]);

    await getUow().commit();

    const savedResonator = dtoFactory.toResonator(await resonatorRepository.findById(resonator_id));
    return savedResonator;
}

export const removeGroupResonator = async (resonator_id) => {
    await resonatorRepository.deleteById(resonator_id);
    return true;
}

export const addQuestionToGroupResonator = async (resonator_id, question_id) => {
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
export const addBulkQuestionsToGroupResonator = async (resonator_id, question_ids) => {

    for (const question_id of question_ids) {
        const [resonator, question] = await Promise.all([
            resonatorRepository.findById(resonator_id),
            questionRepository.findById(question_id)
        ]);
        if (!resonator || !question)
            return null;
        resonator.addQuestion(question_id);
    }
    await getUow().commit();
    return true;
}
export const removeQuestionFromGroupResonator = async (resonator_id, question_id) => {
    const resonator = await resonatorRepository.findById(resonator_id);

    if (!resonator)
        return null;

    resonator.removeQuestion(question_id);

    await getUow().commit();

    return true;
}
export const addItemToGroupResonator = async (resonator_id, item, stream) => {
    const resonator = await resonatorRepository.findById(resonator_id);

    if (!resonator)
        return null;

    const id = uuid();

    const { Location } = await s3.uploadImage(id, stream);

    resonator.addItem({
        ...item,
        id,
        link: Location
    });

    await getUow().commit();

    return true;
}

export const removeGroupResonatorItem = async (resonator_id, item_id) => {
    const resonator = await resonatorRepository.findById(resonator_id);

    if (!resonator)
        return null;

    resonator.removeItem(item_id);

    await getUow().commit();

    return true;
}

export const removeGroupResonatorImage = async (resonator_id, item_id) => {
    const resonator = await resonatorRepository.findById(resonator_id);

    if (!resonator)
        return null;

    let imageInfo = resonator.getImageInfo(item_id);

    if (imageInfo) {
        await s3.deleteFile(imageInfo.id);

        resonator.removeItem(item_id);

        await getUow().commit();
    }

    return true;
}
