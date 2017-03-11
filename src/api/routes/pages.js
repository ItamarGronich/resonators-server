import express from '../express';
import routeHandler from '../routeHandler';
import {getLatestAssetLink} from '../../application/versionableAssets';

express.get('/', serveClient());
express.get('/react*', serveClient());

function serveClient() {
    return routeHandler(async (request, response) => {
        let link = await getLatestAssetLink('resonators-client');

        response.status(200);
        response.render('../pages/index', {
            link
        });
    }, {
        enforceLogin: false
    });
}
