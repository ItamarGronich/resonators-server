import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {resonators as resonatorsDb, resonator_attachments as resonatorAttachmentsDb} from '../sequelize/models';
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
        const resonators = await resonatorsDb.findAll({
            follower_id: followerId,
            include: [resonatorAttachmentsDb]
        });

        if (!resonators)
            return [];

        const foundResonators = resonators.map(dbToDomain.toResonator);

        foundResonators.forEach(resonator => this.trackEntity(resonator));

        return foundResonators;
    }
}

export default new ResonatorsRepository();
