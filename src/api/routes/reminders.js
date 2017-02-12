import express from '../express';
import routeHandler from '../routeHandler';
import enforceLeaderFollowers from '../permissions/enforceLeaderFollowers';
import {getResonators} from '../../application/resonators';

express.get('/leader_followers/:followerId/reminders', routeHandler(async (request, response) => {
    const resonators = await getResonators(request.params.followerId);
    response.status(200);
    response.json(resonators);
}, {
    enforceLeaderFollower: true
}));

express.get('/leader_followers/:followerId/reminders', routeHandler(async (request, response) => {

}));
