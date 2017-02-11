import express from '../express';
import routeHandler from '../routeHandler';
import {getLeaderFollowers, addLeaderFollower} from '../../application/leaderFollowers';

express.get('/leader_followers', routeHandler(async (request, response) => {
    const {user} = request.appSession;

    const followers = await getLeaderFollowers(user.id);

    response.status(200);
    response.json(followers);
}, {
    enforceLogin: true
}));

express.post('/leader_followers', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    let followerRequest = request.body;
    followerRequest = {...followerRequest, leader_id: leader.id};

    const follower = await addLeaderFollower(followerRequest);

    response.status(201);
    response.json(follower);
}, {
    enforceLogin: true
}))
