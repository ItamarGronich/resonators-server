import request from './supertestWrapper';

export function unsubscribe(userId, userLoginId) {
    return request({
        method: 'get',
        url: `/api/users/${userId}/unsubscribe`,
        authorization: userLoginId
    });
}

export function resubscribe(userId, userLoginId) {
    return request({
        method: 'get',
        url: `/api/users/${userId}/resubscribe`,
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

export function startGoogleAuth(userId, action) {
    return request({
        method: 'get',
        url: `/api/startGoogleAuth?userId=${userId}&action=${action}`
    });
}

export function endGoogleAuth(userId, action, code) {
    const state = encodeURIComponent(JSON.stringify({userId, action}));

    return request({
        method: 'get',
        url: `/api/confirmGoogleAuth?state=${state}&code=${code}`
    });
}

export function startGoogleLogin() {
    return request({
        method: 'get',
        url: `/api/startGoogleLogin`
    });
}

export function completeGoogleLogin(authCode) {
    return request({
        method: 'get',
        url: `/api/completeGoogleLogin?code=${authCode}`
    });
}
