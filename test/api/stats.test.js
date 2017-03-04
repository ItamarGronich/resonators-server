import _ from 'lodash';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';
import request from '../api/supertestWrapper';
import uuid from 'uuid/v4';

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

    describe.only('send resonator answer', () => {
        it('post resonator answer', async () => {
            const {resonator, userLogin} = await generateFixtures().preset1();
            const [sentResonator] = await generateFixtures().generateSentResonator(resonator).done();

            const answer = {
                resonator_id: resonator.id,
                question_id: resonator.questions[0].question.id,
                answer_id: resonator.questions[0].question.answers[0].id,
                sent_resonator_id: sentResonator.id
            };

            const response = await request({
                method: 'get',
                url: `/criteria/stats/reminders/${answer.resonator_id}/criteria/submit?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            assert.equal(response.status, 200);

            const getResponse = await request({
                method: 'get',
                url: `/criteria/stats/reminders/${resonator.id}/criteria?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            let responseAnswers = getResponse.body.criteria[answer.question_id];
            responseAnswers = _.omitDeep(responseAnswers, ['id', 'created_at']);
            const addedAnswer = responseAnswers.find(a => a.answer_id === answer.answer_id);
            assert.deepEqual(addedAnswer, {
                answer_id: answer.answer_id,
                resonator_question_id: resonator.questions[0].id,
                sent_resonator_id: answer.sent_resonator_id
            });
        });

        it('post resonator answer - returns the index page', async () => {
            const {resonator, userLogin} = await generateFixtures().preset1();
            const [sentResonator] = await generateFixtures().generateSentResonator(resonator).done();

            const answer = {
                resonator_id: resonator.id,
                question_id: resonator.questions[0].question.id,
                answer_id: resonator.questions[0].question.answers[0].id,
                sent_resonator_id: sentResonator.id
            };

            const response = await request({
                method: 'get',
                url: `/criteria/stats/reminders/${answer.resonator_id}/criteria/submit?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            assert.include(response.text, '<html>');
        });
        it('post resonator answer for a new question', async () => {
            const {resonator, userLogin, leader, clinic} = await generateFixtures().preset1();

            const [question] = await generateFixtures().generateQuestion({
                leader,
                clinic
            }).done();

            const [resonatorQuestion] = await generateFixtures().generateResonatorQuestion({
                question, resonator_id: resonator.id
            }).done();

            const [sentResonator] = await generateFixtures().generateSentResonator(resonator).done();

            const answer = {
                resonator_id: resonator.id,
                question_id: question.id,
                answer_id: question.answers[0].id,
                sent_resonator_id: sentResonator.id
            };

            const response = await request({
                method: 'get',
                url: `/criteria/stats/reminders/${answer.resonator_id}/criteria/submit?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            assert.equal(response.status, 200);

            const getResponse = await request({
                method: 'get',
                url: `/criteria/stats/reminders/${resonator.id}/criteria?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            let responseAnswers = getResponse.body.criteria[answer.question_id];
            responseAnswers = _.omitDeep(responseAnswers, ['id', 'created_at']);
            const addedAnswer = responseAnswers.find(a => a.answer_id === answer.answer_id);
            assert.deepEqual(addedAnswer, {
                answer_id: answer.answer_id,
                resonator_question_id: resonatorQuestion.id,
                sent_resonator_id: answer.sent_resonator_id
            });
        });

        it('cannot post resonator answer for wrong sent_resonator_id', async () => {
            const {resonator, userLogin} = await generateFixtures().preset1();

            const fakeSentResonatorId = uuid();

            const answer = {
                resonator_id: resonator.id,
                question_id: resonator.questions[0].question.id,
                answer_id: resonator.questions[0].question.answers[0].id,
                sent_resonator_id: fakeSentResonatorId
            };

            const response = await request({
                method: 'get',
                url: `/criteria/stats/reminders/${answer.resonator_id}/criteria/submit?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            assert.equal(response.status, 422);
        });

        it('cannot post resonator answer for wrong resonator', async () => {
            const {resonator, userLogin} = await generateFixtures().preset1();
            const [sentResonator] = await generateFixtures().generateSentResonator(resonator).done();

            const fakeResonatorId = uuid();

            const answer = {
                resonator_id: fakeResonatorId,
                question_id: resonator.questions[0].question.id,
                answer_id: resonator.questions[0].question.answers[0].id,
                sent_resonator_id: sentResonator.id
            };

            const response = await request({
                method: 'get',
                url: `/criteria/stats/reminders/${answer.resonator_id}/criteria/submit?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            assert.equal(response.status, 422);
        });

        it('cannot post twice with the same sent resonator', async () => {
            const {resonator, userLogin} = await generateFixtures().preset1();
            const [sentResonator] = await generateFixtures().generateSentResonator(resonator).done();

            const answer = {
                resonator_id: resonator.id,
                question_id: resonator.questions[0].question.id,
                answer_id: resonator.questions[0].question.answers[0].id,
                sent_resonator_id: sentResonator.id
            };

            const response = await request({
                method: 'get',
                url: `/criteria/stats/reminders/${answer.resonator_id}/criteria/submit?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            assert.equal(response.status, 200);

            const response2 = await request({
                method: 'get',
                url: `/criteria/stats/reminders/${answer.resonator_id}/criteria/submit?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            assert.equal(response.status, 200);

            const getResponse = await request({
                method: 'get',
                url: `/criteria/stats/reminders/${resonator.id}/criteria?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            const stats = getResponse.body;

            assert.equal(stats.criteria[answer.question_id].filter(a => a.sent_resonator_id === answer.sent_resonator_id).length, 1);
        });
    });
});
