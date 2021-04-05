import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {google_contacts} from '../sequelize/models';

class GoogleContactRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(entity) {
        return {
            ...entity
        };
    }

    save(googleContact, transaction) {
        return google_contacts.upsert(googleContact, {transaction});
    }

    async getUserContacts(user_id) {
        const contacts = await google_contacts.findAll({ where: {user_id} });

        return contacts.map(dbToDomain.toGoogleContact);
    }

    async getUserContactByEmail(user_id, email) {
        return await google_contacts.findOne({where: {user_id, email}});
    }

    async createUserContact(transaction) {
        return await google_contacts.upsert(transaction);
    }

}

export default new GoogleContactRepository();
