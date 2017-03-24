import _ from 'lodash';
import express from '../express';
import routeHandler from '../routeHandler';
import multer from 'multer';
import {save, getLatestAssetLink} from '../../application/versionableAssets';

const upload = multer();

var assetUpload = upload.fields([{
    name: 'asset_id'
}, {
    name: 'tag'
}, {
    name: 'secret'
}, {
    name: 'media_data'
}]);

express.post('/api/versionable_assets/upload', assetUpload, routeHandler(async (request, response) => {
    const {asset_id, tag, secret} = request.body;
    const fileBuf = _.get(request, 'files.media_data[0].buffer');

    if (!fileBuf) {
        response.status(400);
        return response.json({error: 'no attachment was sent.'});
    }

    const result = await save({asset_id, tag, secret, fileBuf});

    if (result.error) {
        response.status(400);
    } else {
        response.status(200);
    }

    response.json(result);
}, {
    enforceLogin: false
}));

express.get('/api/versionable_assets/:asset_id/latest', async (request, response) => {
    const latestAsset = await getLatestAssetLink(request.params.asset_id);
    response.status(latestAsset ? 200 : 422);
    response.json(latestAsset);
});
