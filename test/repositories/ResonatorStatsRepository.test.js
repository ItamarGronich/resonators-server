import _ from 'lodash';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';
import uuid from 'uuid/v4';
import proxyquire from 'proxyquire';
import dbConn from '../../src/db/sequelize/dbConnection';

describe('ResonatorStatsRepository', () => {
    let repo;

    beforeEach(() => {
        const stubs = {
            '../../application/getUow': {
                default: () => ({
                    trackEntity: () => {}
                }),
                '@global': true
            }
        };

        repo = proxyquire('../../src/db/repositories/ResonatorStatsRepository',
                          stubs).default;
    });

    it('findById', async () => {
        const {resonator} = await generateFixtures()
                           .preset1();

        const result = await repo.findById(resonator.id);

        const id1 = result.criteria[Object.keys(result.criteria)[0]][0].id
        const id2 = result.criteria[Object.keys(result.criteria)[0]][1].id
        const question = resonator.questions[0].question;
        const answer_id = question.answers[0].id;

        const expectedAnswers = _.orderBy(resonator.answers, a => a.sent_resonator_id);
        result.criteria[resonator.questions[0].question.id] = _.orderBy(result.criteria[resonator.questions[0].question.id], a => a.sent_resonator_id);

        assert.deepEqual(_.omitDeep(result, 'created_at'), {
            resonator_id: resonator.id,
            criteria: {
                [resonator.questions[0].question.id]: [{
                    id: expectedAnswers[0].id,
                    answer_id,
                    sent_resonator_id: expectedAnswers[0].sent_resonator_id,
                    resonator_question_id: resonator.questions[0].id
                }, {
                    id: expectedAnswers[1].id,
                    answer_id,
                    sent_resonator_id: expectedAnswers[1].sent_resonator_id,
                    resonator_question_id: resonator.questions[0].id
                }]
            }
        });
    });

    it('findById - missing data', async () => {
        const resonator_id = uuid();
        const result = await repo.findById(resonator_id);
        assert.deepEqual(result, {
            resonator_id,
            criteria: {}
        });
    });

    it('save new answer', async () => {
        const {resonator} = await generateFixtures()
                           .preset1();

        const newAnswer = {
            id: uuid(),
            answer_id: uuid(),
            sent_resonator_id: uuid(),
            resonator_question_id: resonator.questions[0].id,
            question_id: resonator.questions[0].question.id
        };

        const tran = dbConn.transaction();

        const resonatorStats = await repo.findById(resonator.id);

        const resonatorStats2 = JSON.parse(JSON.stringify(resonatorStats));

        resonatorStats.addAnswer(newAnswer);

        await repo.save(resonatorStats, tran, resonatorStats2);

        const resonatorStats3 = await repo.findById(resonator.id);

        assert.deepEqual(_.omitDeep(resonatorStats3, 'created_at'),
                         _.omitDeep(resonatorStats, 'created_at'));
    });
});
