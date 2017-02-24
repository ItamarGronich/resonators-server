import express from '../express';
import routeHandler from '../routeHandler';

express.get('/', routeHandler(async (request, response) => {
    response.status(200);
    response.render('../pages/index');
}, {
    enforceLogin: false
}));
