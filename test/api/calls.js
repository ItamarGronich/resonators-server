import request from './supertestWrapper';

export function unsubscribe(userId, userLoginId) {
    return request({
        method: 'get',
        url: `/api/users/${userId}/unsubscribe`,
        authorization: userLoginId
    });
}

export function getFollowers(leaderLoginId) {
    return request({
        method: 'get',
        url: '/api/leader_followers',
        cookie: `loginId=${leaderLoginId}`
    });
}

export function freezeFollower(leaderLoginId, followerId) {
    return request({
        method: 'post',
        url: `/api/leader_followers/${followerId}/freeze`,
        authorization: leaderLoginId
    });
}

export function unfreezeFollower(leaderLoginId, followerId) {
    return request({
        method: 'post',
        url: `/api/leader_followers/${followerId}/unfreeze`,
        authorization: leaderLoginId
    });
}
