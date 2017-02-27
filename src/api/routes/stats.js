import express from '../express';
import routeHandler from '../routeHandler';
import {getResonatorStats} from '../../application/resonatorStats';

express.get('/criteria/stats/reminders/:resonatorId/criteria', routeHandler(async (request, response) => {
    const {resonatorId} = request.params;

    const stats = await getResonatorStats(resonatorId);

    if (!stats)
        response.status(422);
    else
        response.status(200);

    response.json(stats);
}, {
    enforceLeaderResonator: true
}));
