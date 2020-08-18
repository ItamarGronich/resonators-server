import fs from 'fs';
import {getLatestAssetLink} from '../application/versionableAssets';

export default async function renderClient(request, response, pageData) {
    let clientVersion = await getLatestAssetLink('resonators-client');
    let manifestVersion = await getLatestAssetLink('manifest');

    if (process.env.ENV === 'dev')
        clientVersion = {
            link: 'http://localhost:8000/assets/app.js'
        };
        manifestVersion = {
            link: 'http://localhost:8000/assets/manifest.webmanifest'
        }

    const serverVersion = await readVersion();
    const serverVersionTxt = JSON.stringify(serverVersion);
    const clientVersionTxt = JSON.stringify(clientVersion);

    response.status(200);

    response.render('../pages/index', {
        clientVersion: clientVersionTxt,
        serverVersion: serverVersionTxt,
        scriptUrl: clientVersion.link,
        manifestUrl: manifestVersion.link,
        pageData: pageData && JSON.stringify(pageData)
    });
}

function readVersion() {
    return new Promise((resolve) => {
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
