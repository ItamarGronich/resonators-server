import express from '../express';
import routeHandler from '../routeHandler';

express.get('/', serveClient());
express.get('/react/*', serveClient());

function serveClient() {
    return routeHandler(async (request, response) => {
        response.status(200);
        response.render('../pages/index');
    }, {
        enforceLogin: false
    });
}
