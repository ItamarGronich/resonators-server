import fs from 'fs';
import path from 'path';
import {getLatestAssetLink} from '../application/versionableAssets';

export default async function renderClient(request, response) {
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
