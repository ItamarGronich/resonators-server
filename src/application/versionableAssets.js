import _ from 'lodash';
import versionableAssetsRepository from '../db/repositories/VersionableAssetsRepository';
import VersionableAsset from '../domain/entities/versionableAsset';
import getUow from './getUow';
import cfg from '../cfg';
import uuid from 'uuid/v4';
import s3 from '../s3';

export async function save({asset_id, fileBuf, secret}) {
    if (cfg.uploadAssetsSecret !== secret)
        return {
            error: 'wrong secret'
        };

    const uow = getUow();

    const existingAsset = await versionableAssetsRepository.findLatestById(asset_id);

    const asset = new VersionableAsset({
        id: uuid(),
        asset_id,
        version: _.get(existingAsset, 'version')
    });

    asset.incrementVersion();

    uow.trackEntity(asset, {isNew: true});

    const s3Response = await s3.uploadFile(`assets/${asset.asset_id}/${asset.toString()}`, fileBuf);
    const link = s3Response.Location;
    asset.updateLink(link);

    await uow.commit();

    return {
        link: asset.link
    }
}

export async function getLatestAssetLink(asset_id) {
    const asset = await versionableAssetsRepository.findLatestById(asset_id);
    return asset && asset.link;
}
