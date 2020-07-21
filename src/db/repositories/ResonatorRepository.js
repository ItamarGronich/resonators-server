import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import * as R from 'ramda';

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
        const questionsPromises = this.saveQuestions(resonator, lastResonator, transaction);
        const itemsPromises = this.saveItems(resonator, lastResonator, transaction);
        return Promise.all([upsertPromise, ...questionsPromises, ...itemsPromises]);
    }

    saveQuestions(resonator, lastResonator, transaction) {
        return addRemoveChangedEntities({
            currentGroup: resonator.questions,
            previousGroup: lastResonator.questions,
            dbModel: resonator_questions,
            transaction
        });
    }

    saveItems(resonator, lastResonator, transaction) {
        return addRemoveChangedEntities({
            currentGroup: resonator.items,
            previousGroup: lastResonator.items,
            dbModel: resonator_attachments,
            transaction
        });
    }

    deleteByFollowerId(follower_id) {
        return resonators.destroy({
            where: {
                follower_id
            }
        });
    }
    
    async deleteByFollowerGroupId(follower_group_id) {
        const groupResonators = await this.findByFollowerGroupId(follower_group_id);
        const rows = R.sum(R.map((resonator) => this.deleteChildrenById(resonator.id), groupResonators));
        return rows + resonators.destroy({
            where: {
                follower_group_id
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

    async deleteGroupResonatorById(id) {
        const rows = await this.deleteChildrenById(id);
        return rows + resonators.destroy({
            where: {
                id
            }
        });
    }
    async deleteChildrenById(id) {
        const childResonators = await this.findChildrenById(id);
        return R.sum(R.map((resonator) => this.deleteById(resonator.id), childResonators));
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

    async findChildrenById(resonatorId) {
        const rows = await resonators.findAll({
            where: {
                parent_resonator_id: resonatorId
            },
            include: this.queryInclude()
        });

        if (!rows) {
            return [];
        }

        const foundResonators = rows.map(dbToDomain.toResonator);
        foundResonators.forEach(resonator => this.trackEntity(resonator));
        return foundResonators;
    }

    async findByFollowerId(followerId) {
        const rows = await resonators.findAll({
            where: {
                follower_id: followerId
            },
            include: this.queryInclude()
        });

        if (!rows) {
            return [];
        }

        const foundResonators = rows.map(dbToDomain.toResonator);
        foundResonators.forEach(resonator => this.trackEntity(resonator));
        return foundResonators;
    }

    async findByFollowerGroupId(followerGroupId) {
        const rows = await resonators.findAll({
            where: {
                follower_group_id: followerGroupId
            },
            include: this.queryInclude()
        });

        if (!rows) {
            return [];
        }

        const foundResonators = rows.map(dbToDomain.toResonator);
        foundResonators.forEach(resonator => this.trackEntity(resonator));
        return foundResonators;
    }

    async deleteGroupResonatorForFollower(follower_group_id, follower_id) {
        const groupResonators = await this.findByFollowerGroupId(follower_group_id);
        return resonators.destroy({
            where: {
                follower_id,
                parent_resonator_id: R.map((resonator) => resonator.id, groupResonators),
            }
        });
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
