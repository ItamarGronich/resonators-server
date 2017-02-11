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
        return {
            ...resonator
        };
    }

    async findByFollowerId(followerId) {
        const rows = await resonators.findAll({
            follower_id: followerId,
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
