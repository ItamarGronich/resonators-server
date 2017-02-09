import express from '../express';
import routeHandler from '../routeHandler';
import {getLeaderFollowers} from '../../application/leaderFollowers';

express.get('/leader_followers', routeHandler(async (request, response) => {
    const {user} = request.appSession;

    const followers = await getLeaderFollowers(user.id);

    response.status(200);
    response.json(followers);
}, {
    enforceLogin: true
}));
