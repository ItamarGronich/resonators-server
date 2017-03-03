import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import SentResonator from '../../domain/entities/sentResonator';
import {sent_resonators} from '../sequelize/models';

class SentResonatorRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(sentResonator) {
        return {
            ...sentResonator
        };
    }

    async save(sentResonator, transaction) {
        return await sent_resonators.create(sentResonator, {transaction});
    }

    async findById(id) {
        const row = await sent_resonators.findById(id);

        if (!row)
            return null;

        const sentResonator = dbToDomain.toSentResonator(row);
        this.trackEntity(sentResonator);
        return sentResonator;
    }
}

export default new SentResonatorRepository();
