import followerRepository from '../../db/repositories/FollowerRepository';

export default async function enforceLeaderFollowers({request, response, leaderId, followerId}) {
    const follower = await followerRepository.findById(followerId);
    if (follower.leader_id !== leaderId) {
        response.status(403);
        response.json({ status: 'leader is not permitted to view or edit the given follower.'});
        return false;
    } else
        return true;
}