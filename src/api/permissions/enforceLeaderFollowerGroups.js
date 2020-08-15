import followerGroupRepository from '../../db/repositories/FollowerGroupRepository';

export default async function enforceLeaderFollowerGroups(request, response) {
    const leader = request.appSession.leader || {};
    const followerGroupId = request.params.followerGroupId;
    const followerGroup = await followerGroupRepository.findById(followerGroupId);
    if (!leader.group_permissions || (followerGroup && followerGroup.leader_id !== leader.id)) {
        response.status(403).json({ status: 'leader is not permitted to view or edit the given group.'});
        return false;
    } else
        return true;
}
