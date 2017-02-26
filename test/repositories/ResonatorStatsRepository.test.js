import repo from '../../src/db/repositories/ResonatorStatsRepository';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';

describe('ResonatorStatsRepository', () => {
    it('findById', async () => {
        const {resonator} = await generateFixtures()
                           .preset1();

        const result = await repo.findById(resonator.id);

        const question = resonator.questions[0].question;
        const answerId = question.answers[0].id;

        assert.deepEqual(result, {
            resonator_id: resonator.id,
            criteria: {
                [resonator.questions[0].question.id]: [
                    answerId,
                    answerId
                ]
            }
        });
    });
});
