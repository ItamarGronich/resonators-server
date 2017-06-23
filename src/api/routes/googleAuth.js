import express from '../express';
import routeHandler from '../routeHandler';
import {startGoogleAuth, endGoogleAuth} from '../../application/googleAuth';

express.get('/api/startGoogleAuth', routeHandler(async (request, response) => {
    const {userId} = request.query;

    const url = await startGoogleAuth(userId);

    response.status(200);

    response.json({
        url
    });
}, {
    enforceLogin: false
}));

express.get('/api/confirmGoogleAuth', routeHandler(async (request, response) => {
    const {state, code} = request.query;

    const {userId} = JSON.parse(state);

    const result = await endGoogleAuth(userId, code);

    response.status(200);

    response.json({
        result
    });
}, {
    enforceLogin: false
}));
