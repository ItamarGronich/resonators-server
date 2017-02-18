import _ from 'lodash';
import setLoginCookie from './setLoginCookie';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';
import supertestWrapper from '../api/supertestWrapper';

describe('leader_clinics', () => {
    it('get clinics', async () => {
        const { user, userLogin, clinic } = await generateFixtures().preset1();

        const response = await supertestWrapper({
            method: 'get',
            url: '/leader_clinics',
            cookie: `loginId=${userLogin.id}`
        });

        assert.shallowDeepEqual(response.body, [{
            id: clinic.id,
            user_id: user.id,
            name: clinic.name
        }]);

        assert.isOk(response.body[0].created_at);
        assert.isOk(response.body[0].updated_at);
    });

    it('get clinic criteria', async () => {
        const {userLogin, clinics, questions} = await generateFixtures().presetLeaderWithManyClinics();

        const response = await supertestWrapper({
            method: 'get',
            url: `/leader_clinics/${clinics[0].id}/criteria`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(response.status, 200);

        const question = questions[0];
        const actualQuestions = response.body.map(q => _.omit(q, 'created_at', 'updated_at'));

        assert.deepEqual(actualQuestions, [{
            ...question,
            answers: question.answers.map(a => _.omit(a, 'question_id'))
        }]);

        assert.isOk(response.body[0].created_at);
        assert.isOk(response.body[0].updated_at);
    });

    it('get all leader criteria', async () => {
        const {userLogin, clinics, questions} = await generateFixtures().presetLeaderWithManyClinics();

        const response = await supertestWrapper({
            method: 'get',
            url: `/leader_clinics/all/criteria`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(response.status, 200);

        assertQuestions(response.body, questions);
    });
});

function assertQuestions(actual, expected) {
    const actualQuestions = actual.map(q => _.omit(q, 'created_at', 'updated_at'));

    assert.deepEqual(actualQuestions, expected.map(q => ({
        ...q,
        answers: q.answers.map(a => _.omit(a, 'question_id'))
    })));

    actual.forEach(q => {
        assert.isOk(q.created_at);
        assert.isOk(q.updated_at);
    });
}
