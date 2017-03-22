import _ from 'lodash';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';
import request from '../api/supertestWrapper';
import uuid from 'uuid/v4';

describe('resonator stats', () => {
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
            url: `/criteria/stats/reminders/${resonator.id}.json`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(result.status, 403);
    });

    it('getResonatorStats', async () => {
        const {resonator, userLogin} = await generateFixtures().preset1();

        const result = await request({
            method: 'get',
            url: `/criteria/stats/reminders/${resonator.id}`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(result.status, 200);

        assertResonatorStatsResponse(result, resonator);
    });

    function assertResonatorStatsResponse(result, resonator) {
        result.body.answers.forEach(a => delete a.time);
        result.body.questions.forEach(q => {delete q.created_at; delete q.updated_at;});

        assert.deepEqual(result.body, {
            questions: resonator.questions.map(q => _.omitDeep(q.question, ['question_id'])),
            answers: resonator.answers.map(a => ({
                question_id: resonator.questions.find(q => q.id === a.resonator_question_id).question_id,
                rank: resonator.questions.find(q => q.id === a.resonator_question_id).question.answers.find(_a => _a.id === a.answer_id).rank,
            }))
        });
    }

    describe('send resonator answer', () => {
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
                url: `/criteria/stats/reminders/${resonator.id}?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            resonator.answers.unshift({ answer_id: answer.answer_id, resonator_question_id: resonator.questions[0].id });
            assertResonatorStatsResponse(getResponse, resonator);
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
            assert.include(response.text, 'window.pageData = {"resonator":{');
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

            resonator.questions.push(resonatorQuestion);

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
                url: `/criteria/stats/reminders/${resonator.id}?question_id=${answer.question_id}&answer_id=${answer.answer_id}&sent_resonator_id=${answer.sent_resonator_id}`,
                cookie: `loginId=${userLogin.id}`
            });

            resonator.answers.unshift({ answer_id: answer.answer_id, resonator_question_id: resonatorQuestion.id });
            assertResonatorStatsResponse(getResponse, resonator);
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
        });
    });
});
