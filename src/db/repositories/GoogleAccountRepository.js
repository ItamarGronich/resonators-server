import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {google_accounts} from '../sequelize/models';

class GoogleAccountsRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(entity) {
        return {
            ...entity
        };
    }

    save(googleAccount, transaction) {
        return google_accounts.upsert(googleAccount, {transaction});
    }

    async findByUserId(user_id) {
        const dbRow = await google_accounts.findOne({
            where: {
                user_id
            }
        });

        if (dbRow) {
            const entity = dbToDomain.toGoogleAccount(dbRow);
            this.trackEntity(entity);
            return entity;
        }

        return null;
    }

    async findByEmail(google_email) {
        const dbRow = await google_accounts.findOne({
            where: {
                google_email
            }
        });

        if (dbRow) {
            const entity = dbToDomain.toGoogleAccount(dbRow);
            this.trackEntity(entity);
            return entity;
        }

        return null;
    }

    async findByPk(id) {
        const row = await google_accounts.findByPk(id);
        const entity = dbToDomain.toGoogleAccount(row);
        this.trackEntity(entity);
        return entity;
    }
}

export default new GoogleAccountsRepository();
