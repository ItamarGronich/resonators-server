import express from '../express';
import routeHandler from '../routeHandler';
import {updateFollowerUser, getLeaderFollowers, addLeaderFollower} from '../../application/leaderFollowers';
import userRepository from '../../db/repositories/UserRepository' ;

express.get('/leader_followers', routeHandler(async (request, response) => {
    const {user} = request.appSession;

    const followers = await getLeaderFollowers(user.id);

    response.status(200);
    response.json(followers);
}));

express.post('/leader_followers', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    let followerRequest = request.body;
    followerRequest = {...followerRequest, leader_id: leader.id};

    const follower = await addLeaderFollower(followerRequest);

    response.status(201);
    response.json(follower);
}));

express.put('/leader_followers/:followerId', routeHandler(async (request, response) => {
    const {user: userRequest} = request.body;
    const {followerId} = request.params;

    await updateFollowerUser(followerId, userRequest);

    response.status(200);
    response.json({});
}));
