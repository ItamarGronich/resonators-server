import fs from 'fs';
import path from 'path';
import express from '../express';
import routeHandler from '../routeHandler';
import {getLatestAssetLink} from '../../application/versionableAssets';

express.get('/', serveClient());
express.get('/react*', serveClient());

function serveClient() {
    return routeHandler(async (request, response) => {
        let clientVersion = await getLatestAssetLink('resonators-client');

        if (process.env.ENV === 'dev')
            clientVersion = {
                link: 'http://localhost:8000/assets/app.js'
            };

        const serverVersion = await readVersion();
        const serverVersionTxt = JSON.stringify(serverVersion);
        const clientVersionTxt = JSON.stringify(clientVersion);

        response.status(200);

        response.render('../pages/index', {
            clientVersion: clientVersionTxt,
            serverVersion: serverVersionTxt,
            scriptUrl: clientVersion.link
        });
    }, {
        enforceLogin: false
    });
}

function readVersion() {
    return new Promise((resolve, reject) => {
        fs.readFile('./version.txt', 'utf8', (err, data) => {
            if (err)
                return resolve({});

            const rows = data.split('\n');
            const version = {
                version: rows[0],
                time: rows[1]
            };

            resolve(version);
        });
    });
}
