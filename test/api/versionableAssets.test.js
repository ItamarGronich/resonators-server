import _ from 'lodash';
import path from 'path';
import request from './supertestWrapper';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {versionable_assets} from '../../src/db/sequelize/models';
import * as dbToDomain from '../../src/db/dbToDomain';
import {assert} from 'chai';
import uuid from 'uuid/v4';
import cfg from '../../src/cfg';

describe('versionable assets', () => {
    const secret = cfg.uploadAssetsSecret;
    const attachment = {
        kind: 'image/png',
        path: path.resolve(__dirname, '../image.jpg')
    };

    async function queryAsset(asset_id) {
        const row = await versionable_assets.findOne({where: {asset_id}, order: [['created_at', 'DESC']]});
        return dbToDomain.toVersionableAsset(row);
    }

    it('save a new asset', async () => {
        const asset_id = `asset_${uuid()}`;
        const response = await request({
            url: '/versionable_assets/upload',
            method: 'post',
            fields: {
                asset_id,
                secret
            },
            attachment
        });

        assert.equal(response.status, 200);
        assert.deepEqual(response.body, {
            link: ''
        });

        const entity = await queryAsset(asset_id);

        assert.deepEqual(_.omit(entity, 'created_at', 'id'), {
            asset_id,
            version: 1,
            link: ''
        });
    });

    it('save a new version of an existing asset', async () => {
        const [asset] = await generateFixtures().generateVersionableAsset().done();

        const response = await request({
            url: '/versionable_assets/upload',
            method: 'post',
            fields: {
                asset_id: asset.asset_id,
                secret
            },
            attachment
        });

        const entity = await queryAsset(asset.asset_id);

        assert.deepEqual(_.omit(entity, 'created_at', 'id'), {
            asset_id: asset.asset_id,
            version: 2,
            link: ''
        });
    });

    it('save with wrong secret', async () => {
        const asset_id = `asset_${uuid()}`;
        const response = await request({
            url: '/versionable_assets/upload',
            method: 'post',
            fields: {
                asset_id,
                secret: 'foo'
            },
            attachment
        });

        assert.equal(response.status, 400);
        assert.deepEqual(response.body, {
            error: 'wrong secret'
        });
    });

    it('increment only the given asset_id', async () => {
        const [asset1, asset2] = await generateFixtures()
                                        .generateVersionableAsset()
                                        .generateVersionableAsset()
                                        .done();

        await request({
            url: '/versionable_assets/upload',
            method: 'post',
            fields: {
                asset_id: asset1.asset_id,
                secret
            },
            attachment
        });

        const asset1Entity = await queryAsset(asset1.asset_id);
        const asset2Entity = await queryAsset(asset2.asset_id);

        assert.equal(asset1Entity.version, 2);
        assert.equal(asset2Entity.version, 1);
    });

    it('get latest', async () => {
        const [asset] = await generateFixtures().generateVersionableAsset().done();

        const response = await request({
            url: `/versionable_assets/${asset.asset_id}/latest`,
            method: 'get'
        });

        assert.equal(response.status, 200);
        assert.deepEqual(response.body, {
            link: 'foo'
        });
    });

    it('no attachment was sent', () => {

    });

    // it('rollback', async () => {
    //     const [asset] = await generateFixtures().generateVersionableAsset().done();
    //
    //     const response = await request({
    //         url: '/versionable_assets/upload',
    //         method: 'post',
    //         fields: {
    //             asset_id: asset.asset_id,
    //             secret
    //         },
    //         attachment
    //     });
    //
    //     const rollbackResponse = await request({
    //         url: `/versionable_assets/${asset.asset_id}/rollback`,
    //         method: 'post',
    //         body: {
    //             secret
    //         }
    //     });
    //
    //     assert.equal(rollbackResponse.status, 200);
    //
    //     assert.deepEqual(rollbackResponse.body, {
    //         status: `rolled back to ${asset.asset_id}-1`
    //     });
    //
    //     const entity = await queryAsset(asset.asset_id);
    //
    //     assert.deepEqual(_.omit(entity, 'created_at', 'id'), {
    //         asset_id: asset.asset_id,
    //         version: 1,
    //         link: null
    //     });
    // });
    //
    // it('rollback with wrong secret', () => {
    //
    // });
});
