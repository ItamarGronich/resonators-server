import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';

import {
    resonators,
    resonator_attachments,
    resonator_questions,
    questions,
    answers
} from '../sequelize/models';

import Resonators from '../../domain/entities/resonator';

class ResonatorsRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(resonator) {
        const repeat_days = (resonator.repeat_days || {}).reduce((acc, cur) => {
            return acc + ',' + cur;
        }, '').slice(1);

        return {
            ...resonator,
            repeat_days
        };
    }

    async save(resonator, tran) {
        return resonators.upsert(resonator, tran);
    }

    async findById(resonatorId) {
        const row = await resonators.findById(resonatorId);
        return dbToDomain.toResonator(row);
    }

    async findByFollowerId(followerId) {
        const rows = await resonators.findAll({
            where: {
                follower_id: followerId
            },
            include: [
                resonator_attachments, {
                model: resonator_questions,
                include: [{
                    model: questions,
                    include: [answers]
                }]
            }]
        });

        if (!rows)
            return [];

        const foundResonators = rows.map(dbToDomain.toResonator);

        foundResonators.forEach(resonator => this.trackEntity(resonator));

        return foundResonators;
    }
}

export default new ResonatorsRepository();
