import express from '../express';
import routeHandler from '../routeHandler';
import enforceLeaderFollowers from '../permissions/enforceLeaderFollowers';
import {getResonators} from '../../application/resonators';

express.get('/leader_followers/:followerId/reminders', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    const {followerId} = request.params;

    if (!await enforceLeaderFollowers({request, response, leaderId: leader.id, followerId})) return;

    const resonators = await getResonators(request.params.followerId);

    response.status(200);
    response.json(resonators);
}, {
    enforceLogin: true
}));
