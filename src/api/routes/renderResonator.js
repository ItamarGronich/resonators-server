import express from '../express';
import routeHandler from '../routeHandler';
import {renderResonator} from '../../application/resonatorRenderer';

express.get('/renderResonator/:resonatorId', routeHandler(async (request, response) => {
    const {resonatorId} = request.params;

    const template = await renderResonator(resonatorId);

    if (!template)
        response.status(422);
    else
        response.status(200);

    response.set('Content-Type', 'text/html');
    response.send(template);
}, {
    enforceLogin: false
}));
