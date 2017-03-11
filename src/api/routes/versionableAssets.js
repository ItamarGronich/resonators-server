import _ from 'lodash';
import express from '../express';
import routeHandler from '../routeHandler';
import multer from 'multer';
import {save, getLatestAssetLink} from '../../application/versionableAssets';

const upload = multer();

var assetUpload = upload.fields([{
    name: 'asset_id'
}, {
    name: 'secret'
}, {
    name: 'media_data'
}]);

express.post('/versionable_assets/upload', assetUpload, routeHandler(async (request, response) => {
    const {asset_id, secret} = request.body;
    const fileBuf = _.get(request, 'files.media_data[0].buffer');

    if (!fileBuf) {
        response.status(400);
        return response.json({error: 'no attachment was sent.'});
    }

    const result = await save({asset_id, secret, fileBuf});

    if (result.error) {
        response.status(400);
    } else {
        response.status(200);
    }

    response.json(result);
}, {
    enforceLogin: false
}));

express.get('/versionable_assets/:asset_id/latest', async (request, response) => {
    const link = await getLatestAssetLink(request.params.asset_id);
    response.status(link ? 200 : 422);
    response.json({ link });
});
