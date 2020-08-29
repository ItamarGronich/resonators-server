import log from '../infra/log';
import followerGroupRepository from '../db/repositories/FollowerGroupRepository';
import followerGroupFollowerRepository from '../db/repositories/FollowerGroupFollowersRepository';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import leaderRepository from '../db/repositories/LeaderRepository';
import FollowerGroup from '../domain/entities/followerGroup';
import * as dtoFactory from './dto/index';
import { createResonator } from './resonators';
import getUow from './getUow';
import FollowerGroupFollower from '../domain/entities/followerGroupFollower';
import uuid from 'uuid/v4';
import * as R from 'ramda';


export const getLeaderFollowerGroups = async (leader_id) => {
    const followerGroups = await followerGroupRepository.findByLeaderId(leader_id);
    const followerGroupsDto = followerGroups.map(dtoFactory.toFollowerGroup);
    return followerGroupsDto;
}

export const getLeader = async (leader_id) => {
    const leader = await leaderRepository.findById(leader_id);
    const dto = dtoFactory.toLeader(leader);
    return dto;
}
export const addLeaderFollowerGroup = async ({ group_name, leader_id, clinic_id }) => {

    const followerGroup = new FollowerGroup({
        group_name,
        leader_id,
        clinic_id,
        status: 2,
        frozen: false,
    });

    const uow = getUow();
    uow.trackEntity(followerGroup, { isNew: true });
    await uow.commit();
    const newFollowerGroup = await followerGroupRepository.findById(followerGroup.id);
    const followerGroupDto = dtoFactory.toFollowerGroup(newFollowerGroup);
    return followerGroupDto;
}

export const deleteLeaderFollowerGroup = async (followerGroupId) =>
    await Promise.all([
        await followerGroupRepository.deleteById(followerGroupId),
        await resonatorRepository.deleteByFollowerGroupId(followerGroupId),
    ]);

export const updateFollowerGroup = async (followerGroupId, data) => {
    const uow = getUow();
    const followerGroup = await followerGroupRepository.findById(followerGroupId);
    for (const field in data) {
        followerGroup[field] = data[field];
    }
    await uow.commit();
    return followerGroup;
}

export const getGroupFollowers = async (followerGroupId) => {
    const followers = await followerGroupFollowerRepository.findFollowersByGroupId(followerGroupId);
    const followersDto = followers.map(dtoFactory.toFollower);
    return followersDto;
}

export const updateGroupFollowers = async (followerGroupId, data) => {
    const uow = getUow();
    const followerGroup = await followerGroupRepository.findById(followerGroupId);
    const followerGroupResonators = await resonatorRepository.findByFollowerGroupId(followerGroupId);
    const members = await getGroupFollowers(followerGroupId);
    const memberIds = R.map(({ id }) => id, members);
    for (const followerId of R.difference(data, memberIds)) {
        const followerGroupFollower = new FollowerGroupFollower({
            id: uuid(),
            follower_group_id: followerGroup.id,
            follower_id: followerId,
        });
        for (const { id, follower_group_id, questions, items, ...resonator } of followerGroupResonators) {
            const newResonator = await createResonator(resonator.leader_id, {
                ...resonator,
                parent_resonator_id: id,
                follower_id: followerId,
            });
            const newResonatorObject = await resonatorRepository.findById(newResonator.id);
            for (const question of questions)
                newResonatorObject.addQuestion(question.question_id);
            for (const { id, ...item } of items)
                newResonatorObject.addItem({ id: uuid(), ...item });
        }
        uow.trackEntity(followerGroupFollower, { isNew: true });
        await uow.commit();
    }

    await Promise.all(R.difference(memberIds, data).map(async (followerId) =>
        await removeFollowerFromGroup(followerGroupId, followerId)
    ));
}

export async function freezeFollowerGroup(followerGroupId) {
    const followerGroup = await followerGroupRepository.findById(followerGroupId);

    if (followerGroup) {
        log.info('freezing follower group', followerGroupId);
        followerGroup.freeze();
        await getUow().commit();
        return true;
    }
}

export async function unfreezeFollowerGroup(followerGroupId) {
    const followerGroup = await followerGroupRepository.findById(followerGroupId);

    if (followerGroup) {
        log.info('unfreezing follower group', followerGroupId);
        followerGroup.unfreeze();
        await getUow().commit();
        return true;
    }
}

const removeFollowerFromGroup = async (followerGroupId, followerId) =>
    await Promise.all([
        await followerGroupFollowerRepository.delete(followerGroupId, followerId),
        await resonatorRepository.deleteGroupResonatorsForFollower(followerGroupId, followerId),
    ]);
