import followerGroupRepository from '../db/repositories/FollowerGroupRepository';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import leaderRepository from '../db/repositories/LeaderRepository';
import FollowerGroup from '../domain/entities/followerGroup';
import * as dtoFactory from './dto/index';
import getUow from './getUow';

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
        followerGroupRepository.deleteById(followerGroupId),
        resonatorRepository.deleteByFollowerGroupId(followerGroupId), // TODO: add function (with deleteByParentResonatorId for it to use)
    ]);

export const updateFollowerGroup = async (followerGroupId, data) => {
    const followerGroup = await followerGroupRepository.findById(followerGroupId);
    followerGroup = Object.assign({}, {...followerGroup, data});
    await getUow().commit();
}
