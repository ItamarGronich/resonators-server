import _ from 'lodash';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';
import request from '../api/supertestWrapper';

describe('resonator stats', () => {
    beforeEach(() => {

    });

    it('getResonatorStats - resonator does not belong to leader', async () => {
        const {resonator} = await generateFixtures().preset1();

        const [userLogin] = await generateFixtures()
                                .generateUserLogin()
                                .done();

        const [leader] = await generateFixtures()
                                .generateLeader(userLogin.user)
                                .done();

        const result = await request({
            method: 'get',
            url: `/criteria/stats/reminders/${resonator.id}/criteria`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(result.status, 403);
    });

    it('getResonatorStats', async () => {
        const {resonator, userLogin} = await generateFixtures().preset1();

        const result = await request({
            method: 'get',
            url: `/criteria/stats/reminders/${resonator.id}/criteria`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(result.status, 200);

        let expectedAnswers = [{
            ...resonator.answers[1],
        }, {
            ...resonator.answers[0]
        }];

        const rqid = resonator.questions[0].question.id;
        expectedAnswers = _.orderBy(expectedAnswers, a => a.id);
        const responseCriteria = _(result.body.criteria[rqid])
        .orderBy(a => a.id)
        .map(a => ({..._.omit(a, 'created_at')}))
        .value();

        assert.deepEqual({...result.body, criteria: responseCriteria}, {
            resonator_id: resonator.id,
            criteria: expectedAnswers
        });
    });
});
