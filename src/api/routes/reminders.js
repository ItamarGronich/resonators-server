import express from '../express';
import routeHandler from '../routeHandler';
import enforceLeaderFollowers from '../permissions/enforceLeaderFollowers';
import {getResonators, createResonator} from '../../application/resonators';

express.get('/leader_followers/:followerId/reminders', routeHandler(async (request, response) => {
    const resonators = await getResonators(request.params.followerId);
    response.status(200);
    response.json(resonators);
}, {
    enforceLeaderFollower: true
}));

express.post('/leader_followers/:followerId/reminders', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    const result = await createResonator(leader.id, request.body);
    response.status(201);
    response.json(result);
}, {
    enforceLeaderFollower: true
}));
