import request from './supertestWrapper';

export function unsubscribe(userId, userLoginId) {
    return request({
        method: 'get',
        url: `/api/users/${userId}/unsubscribe`,
        authorization: userLoginId
    });
}
