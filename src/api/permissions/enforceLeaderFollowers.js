import followerRepository from '../../db/repositories/FollowerRepository';

export default async function enforceLeaderFollowers(request, response) {
    const leader = request.appSession.leader || {};
    const followerId = request.params.followerId;
    const follower = await followerRepository.findById(followerId);
    if (follower && follower.leader_id !== leader.id) {
        response.status(403);
        response.json({ status: 'leader is not permitted to view or edit the given follower.'});
        return false;
    } else
        return true;
}
