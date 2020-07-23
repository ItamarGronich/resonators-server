import followerGroupRepository from '../db/repositories/FollowerGroupRepository';
import followerGroupFollowerRepository from '../db/repositories/FollowerGroupFollowersRepository';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import leaderRepository from '../db/repositories/LeaderRepository';
import FollowerGroup from '../domain/entities/followerGroup';
import * as dtoFactory from './dto/index';
import getUow from './getUow';
import FollowerGroupFollower from '../domain/entities/followerGroupFollower';
import uuid from 'uuid/v4';
import * as R from 'ramda';


export const getLeaderFollowerGroups = async (user_id) => {
    const followerGroups = await followerGroupRepository.findByLeaderUserId(user_id);
    const followerGroupsDto = followerGroups.map(dtoFactory.toFollowerGroup);
    return followerGroupsDto;
}

export const getLeader = async (leader_id) => {
    const leader = await leaderRepository.findById(leader_id);
    const dto = dtoFactory.toLeader(leader);
    return dto;
}
export const addLeaderFollowerGroup = async ({group_name, leader_id, clinic_id}) => {
    const followerGroup = new FollowerGroup({
        group_name,
        leader_id,
        clinic_id,
        status: 2
    });

    const uow = getUow();
    uow.trackEntity(followerGroup, {isNew: true});
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
    const followerGroup = await followerGroupRepository.findById(followerGroupId);
    followerGroup = Object.assign({}, {...followerGroup, data});
    await getUow().commit();
}

export const addFollowersToGroup = async (followerGroupId, data) => {
    const uow = getUow();
    const followerGroup = await followerGroupRepository.findById(followerGroupId);
    R.map(async (followerId) => {
        const followerGroupFollower = new FollowerGroupFollower({
            id: uuid(),
            follower_group_id : followerGroup.id,
            follower_id : followerId,
            });

            uow.trackEntity(followerGroupFollower, {isNew: true});
            await uow.commit();
    }, data.followerIdList)
}

export const removeFollowerFromGroup = async (followerGroupId, followerId) =>
await Promise.all([
    await followerGroupFollowerRepository.delete(followerGroupId, followerId),
    await resonatorRepository.deleteGroupResonatorsForFollower(followerGroupId, followerId),
]);
    
