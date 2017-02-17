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

    getQuestionsDiff(resonator, lastResonator) {
        const curQuestions = resonator.questions || [];
        const prevQuestions = lastResonator.questions || [];

        return [...curQuestions, ...prevQuestions].reduce((acc, cur) => {
            if (!_.find(prevQuestions, q => q.id === cur.id))
                acc.addedQuestions.push(cur);
            else if (!_.find(curQuestions, q => q.id === cur.id))
                acc.removedQuestions.push(cur);

            return acc;
        }, {
            addedQuestions: [],
            removedQuestions: []
        });
    }

    save(resonator, tran, lastResonator) {
        const upsertPromise = resonators.upsert(resonator, tran);
        let questionsPromises = [];

        questionsPromises = this.saveQuestions(resonator, lastResonator);

        return Promise.all([upsertPromise, ...questionsPromises]);
    }

    saveQuestions(resonator, lastResonator) {
        const {
            addedQuestions,
            removedQuestions
        } = this.getQuestionsDiff(resonator, lastResonator);

        const addQuestionsPromises = addedQuestions.map(q => resonator_questions.create(q));
        const removedQuestionsPromises = removedQuestions.map(q => resonator_questions.destroy({
            where: {
                id: q.id
            }
        }));

        return [...addQuestionsPromises, ...removedQuestionsPromises];
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
