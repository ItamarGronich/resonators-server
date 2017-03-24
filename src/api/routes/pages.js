import express from '../express';
import routeHandler from '../routeHandler';
import renderClient from '../renderClient';

express.get(/^(?!\/api).*$/, serveClient());

function serveClient() {
    return routeHandler(async (request, response) => {
        await renderClient(request, response);
    }, {
        enforceLogin: false
    });
}
