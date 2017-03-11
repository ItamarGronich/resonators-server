import Repository from './Repository';
import {versionable_assets} from '../sequelize/models';
import * as dbToDomain from '../dbToDomain';
import uuid from 'uuid/v4';

class VersionableAssetsRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(entity) {
        return {
            id: entity.id,
            asset_id: entity.asset_id,
            asset_version: entity.version,
            link: entity.link
        };
    }

    async save(dbEntity, transaction) {
        return versionable_assets.create(dbEntity, transaction);
    }

    async findLatestById(asset_id) {
        const row = await versionable_assets.findOne({
            where: {
                asset_id
            },

            order: [
                ['created_at', 'DESC']
            ]
        });

        if (!row)
            return null;

        const entity = dbToDomain.toVersionableAsset(row);

        this.trackEntity(entity);

        return entity;
    }
}

export default new VersionableAssetsRepository();
