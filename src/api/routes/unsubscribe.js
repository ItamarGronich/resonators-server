import express from '../express';
import routeHandler from '../routeHandler';
import {unsubscribe} from '../../application/unsubscribe';

express.get('/api/users/:user_id/unsubscribe', routeHandler(async (request, response) => {
    const success = await unsubscribe(request.params.user_id);

    if (success)
        response.status(200);
    else
        response.status(422);

    response.send('You have been unsubscribed from the Resonators system.');
}, {
    enforceLogin: false
}));
