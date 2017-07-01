import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';

import {
    resonators,
    resonator_attachments,
    resonator_questions,
    questions,
    answers
} from '../sequelize/models';

import addRemoveChangedEntities from './addedRemovedEntities';

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

    save(resonator, transaction, lastResonator = {}) {
        const upsertPromise = resonators.upsert(resonator, {transaction});
        const questionsPromises = this.saveQuestions(resonator, lastResonator);
        const itemsPromises = this.saveItems(resonator, lastResonator);
        return Promise.all([upsertPromise, ...questionsPromises, ...itemsPromises]);
    }

    saveQuestions(resonator, lastResonator) {
        return addRemoveChangedEntities({
            currentGroup: resonator.questions,
            previousGroup: lastResonator.questions,
            dbModel: resonator_questions
        });
    }

    saveItems(resonator, lastResonator) {
        return addRemoveChangedEntities({
            currentGroup: resonator.items,
            previousGroup: lastResonator.items,
            dbModel: resonator_attachments
        });
    }

    deleteByFollowerId(follower_id) {
        return resonators.destroy({
            where: {
                follower_id
            }
        });
    }

    deleteById(id) {
        return resonators.destroy({
            where: {
                id
            }
        });
    }

    async findById(resonatorId) {
        const row = await resonators.findOne({
            where: {
                id: resonatorId
            },
            include: this.queryInclude()
        });

        if (!row) {
            return null;
        }

        const resonator = dbToDomain.toResonator(row);

        this.trackEntity(resonator);

        return resonator;
    }

    async findByFollowerId(followerId) {
        const rows = await resonators.findAll({
            where: {
                follower_id: followerId
            },
            include: this.queryInclude()
        });

        if (!rows)
            return [];

        const foundResonators = rows.map(dbToDomain.toResonator);

        foundResonators.forEach(resonator => this.trackEntity(resonator));

        return foundResonators;
    }

    queryInclude() {
        return [
            resonator_attachments, {
                model: resonator_questions,
                include: [{
                    model: questions,
                    include: [answers]
                }]
            }
        ];
    }
}

export default new ResonatorsRepository();
