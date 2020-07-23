import Resonator from '../domain/entities/resonator';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import questionRepository from '../db/repositories/QuestionRepository';
import followerGroupRepository from '../db/repositories/FollowerGroupRepository';
import * as dtoFactory from './dto/index';
import updatePermittedFields from './updatePermittedFields';
import s3 from '../s3';
import getUow from './getUow';
import uuid from 'uuid/v4';
import childResonators from './resonators';
import FollowerGroupFollowersRepository from '../db/repositories/FollowerGroupFollowersRepository';
import * as R from 'ramda';


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
        pop_email: false,
        leader_id
    });

    uow.trackEntity(resonator, { isNew: true });
    await uow.commit();

    const followerGroup = await followerGroupRepository.findById(resonatorRequest.follower_group_id);
    const followersInGroup = await FollowerGroupFollowersRepository.findFollowersByGroupId(followerGroup.id);

    const savedResonators = await Promise.all(R.map(async (follower) => {
        await childResonators.createResonator(leader_id, {
            ...resonatorRequest,
            parent_resonator_id: resonator.id,
            follower_group_id: null,
            follower_id: follower.id,
        });
    }, followersInGroup));

    const savedResonator = dtoFactory.toResonator(await resonatorRepository.findById(resonator.id));
    return [savedResonator, ...savedResonators];
}

export const updateGroupResonator = async (resonator_id, updatedFields) => {
    const resonator = await resonatorRepository.findById(resonator_id);

    if (!resonator)
        return null;

    updatePermittedFields(resonator, updatedFields, [
        'title', 'link', 'description', 'content', 'repeat_days', 'disable_copy_to_leader', 'pop_time',
        'one_off', 'ttl_policy', 'interaction_type', 'selected_questionnaire', 'questionnaire_details'
    ]);

    await getUow().commit();

    const foundChildResonators = await resonatorRepository.findChildrenById(resonator.id);
    const savedResonators = await Promise.all(R.map(async (childResonator) => {
        await childResonators.updateResonator(childResonator.id, updatedFields);
    }, foundChildResonators));

    const savedResonator = dtoFactory.toResonator(await resonatorRepository.findById(resonator_id));
    return [savedResonator, ...savedResonators];
}

export const removeGroupResonator = async (resonator_id) => {
    await resonatorRepository.deleteGroupResonatorById(resonator_id);
    return true;
}

export const addQuestionToGroupResonator = async (resonator_id, question_id) => {
    const [resonator, question] = await Promise.all([
        resonatorRepository.findById(resonator_id),
        questionRepository.findById(question_id)
    ]);

    if (!resonator || !question)
        return null;
    
    const foundChildResonators = await resonatorRepository.findChildrenById(resonator.id);
    R.map((childResonator) => {
         childResonator.addQuestion(question_id);
    }, foundChildResonators);

    resonator.addQuestion(question_id);
    await getUow().commit();
    return true;
}
export const addBulkQuestionsToGroupResonator = async (resonator_id, question_ids) => {

    const resonator = resonatorRepository.findById(resonator_id);
    const foundChildResonators = await resonatorRepository.findChildrenById(resonator.id);

    for (const question_id of question_ids) {
        const question = await questionRepository.findById(question_id);
        if (!resonator || !question)
            return null;

        R.map((childResonator) => {
            childResonator.addQuestion(question_id);
        }, foundChildResonators);

        resonator.addQuestion(question_id);
    }
    await getUow().commit();
    return true;
}
export const removeQuestionFromGroupResonator = async (resonator_id, question_id) => {
    const resonator = await resonatorRepository.findById(resonator_id);

    if (!resonator)
        return null;

    const foundChildResonators = await resonatorRepository.findChildrenById(resonator.id);
    R.map((childResonator) => {
        childResonator.removeQuestion(question_id);
    }, foundChildResonators);

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

    const foundChildResonators = await resonatorRepository.findChildrenById(resonator.id);
    R.map((childResonator) => {
        childResonator.addItem({
            ...item,
            id,
            link: Location
        });
    }, foundChildResonators);

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

    const foundChildResonators = await resonatorRepository.findChildrenById(resonator.id);
    R.map((childResonator) => {
        childResonator.removeItem(item_id);
    }, foundChildResonators);

    resonator.removeItem(item_id);

    await getUow().commit();

    return true;
}

export const removeGroupResonatorImage = async (resonator_id, item_id) => {
    const resonator = await resonatorRepository.findById(resonator_id);

    if (!resonator)
        return null;

    const imageInfo = resonator.getImageInfo(item_id);

    if (imageInfo) {
        await s3.deleteFile(imageInfo.id);

        const foundChildResonators = await resonatorRepository.findChildrenById(resonator.id);
        R.map((childResonator) => {
            childResonator.removeItem(item_id);
        }, foundChildResonators);

        resonator.removeItem(item_id);

        await getUow().commit();
    }

    return true;
}
