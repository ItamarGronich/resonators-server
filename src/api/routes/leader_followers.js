import express from '../express';
import routeHandler from '../routeHandler';

import {
    updateFollowerUser,
    getLeaderFollowers,
    addLeaderFollower,
    deleteLeaderFollower,
    freezeFollower,
    unfreezeFollower
} from '../../application/leaderFollowers';

express.get('/api/leader_followers\.:ext?', routeHandler(async (request, response) => {
    const {user} = request.appSession;

    const followers = await getLeaderFollowers(user.id);

    response.status(200);
    response.json(followers);
}));

express.post('/api/leader_followers\.:ext?', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    let followerRequest = request.body;
    followerRequest = {...followerRequest, leader_id: leader.id};

    const follower = await addLeaderFollower(followerRequest);

    response.status(201);
    response.json(follower);
}));

express.put('/api/leader_followers/:followerId\.:ext?', routeHandler(async (request, response) => {
    const {user: userRequest} = request.body;
    const {followerId} = request.params;

    await updateFollowerUser(followerId, userRequest);

    response.status(200);
    response.json({});
}, {
    enforceLeaderFollower: true
}));

express.delete('/api/leader_followers/:followerId\.:ext?', routeHandler(async (request, response) => {
    const {followerId} = request.params;

    const result = await deleteLeaderFollower(followerId);

    response.status(result ? 200 : 422);
    response.json({});
}, {
    enforceLeaderFollower: true
}));

express.post('/api/leader_followers/:followerId/freeze\.:ext?', routeHandler(async (request, response) => {
    const {followerId} = request.params;

    const result = await freezeFollower(followerId);

    response.status(result ? 200 : 422);
    response.json({});
}, {
    enforceLeaderFollower: true
}));

express.post('/api/leader_followers/:followerId/unfreeze\.:ext?', routeHandler(async (request, response) => {
    const {followerId} = request.params;

    const result = await unfreezeFollower(followerId);

    response.status(result ? 200 : 422);
    response.json({});
}, {
    enforceLeaderFollower: true
}));
