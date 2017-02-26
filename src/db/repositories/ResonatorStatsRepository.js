import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';

import {
    resonators,
    questions,
    resonator_questions,
    resonator_answers
} from '../sequelize/models';

import ResonatorStats from '../../domain/entities/resonatorStats';
import addRemoveChangedEntities from './addedRemovedEntities';

class ResonatorStatsRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(resonatorStats) {
        return {
            ...resonatorStats
        };
    }

    save(resonatorStats) {
        const upsertPromise = resonators.upsert(resonator, tran);
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

    async findById(resonator_id) {
        const rows = await resonator_answers.findAll({
            include: [{
                model: resonator_questions,
                include: [{
                    model: resonators,
                    where: {id: resonator_id}
                },
                questions]
            }]
        });

        const questionAnswerPair = rows.map(r => {
            const question_id = r.resonator_question.question_id;
            const answer_id = r.get('answer_id');

            return {
                question_id,
                answer_id
            };
        });

        let questionGroup = _.groupBy(questionAnswerPair, p => p.question_id);

        questionGroup = _.reduce(Object.keys(questionGroup), (acc, cur) => {
            acc[cur] = questionGroup[cur].map(a => a.answer_id);
            return acc;
        }, {});

        const resonatorStats = new ResonatorStats({
            resonator_id,
            criteria: questionGroup
        });

        return resonatorStats;
    }
}

export default new ResonatorStatsRepository();
