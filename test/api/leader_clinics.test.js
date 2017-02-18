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

    it('add clinic criteria', async () => {
        const {userLogin, clinics, questions} = await generateFixtures().presetLeaderWithManyClinics();

        const clinic = clinics[0];

        const newQuestion = {
            clinic_id: clinic.id,
            description: 'question description',
            question_kind: 'numeric',
            title: 'a question',
            answers: [{
                rank: 1,
                body: 'answer 1'
            }, {
                rank: 3,
                body: 'answer 2'
            }]
        };

        const response = await supertestWrapper({
            method: 'post',
            url: `/leader_clinics/${clinic.id}/criteria`,
            cookie: `loginId=${userLogin.id}`,
            body: newQuestion
        });

        assert.equal(response.status, 201);

        newQuestion.id = response.body.id;
        newQuestion.leader_id = response.body.leader_id;
        newQuestion.removed = false;
        newQuestion.answers = newQuestion.answers.map((a, i) => ({
            ...a,
            id: response.body.answers[i].id
        }));

        assertQuestions([response.body], [newQuestion]);

        const clinicQuestionsResponse = await supertestWrapper({
            method: 'get',
            url: `/leader_clinics/${clinic.id}/criteria`,
            cookie: `loginId=${userLogin.id}`
        });

        assertQuestions(clinicQuestionsResponse.body,
                        [newQuestion].concat(questions[0]));
    });
});

function assertQuestions(actual, expected) {
    actual = _.orderBy(actual, q => q.id);
    expected = _.orderBy(expected, q => q.id);

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
