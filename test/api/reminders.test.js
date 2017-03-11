import _ from 'lodash';
import path from 'path';
import {fooUserLogin} from '../dbFixtures/user_logins';
import {putFollower} from '../dbFixtures/followers';
import {resonator} from '../dbFixtures/resonators';
import {bazLeader} from '../dbFixtures/leaders';
import setLoginCookie from './setLoginCookie';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';
import moment from 'moment';
import supertestWrapper from './supertestWrapper';

describe('reminders', () => {
    it('block unauthorized leader', async () => {
        const { userLogin, follower } = await generateFixtures().preset1();

        const {status, body} = await supertestWrapper({
            url: `/leader_followers/${follower.id}/reminders`,
            method: 'get',
            cookie: `loginId=${fooUserLogin.id}`
        });

        assert.equal(status, 403);

        assert.deepEqual(body, {
            status: 'leader is not permitted to view or edit the given follower.'
        });
    });

    it('get followers\' resonators', async () => {
        const { userLogin, follower, resonator } = await generateFixtures().preset1();

        const {status, body} = await supertestWrapper({
            method: 'get',
            url: `/leader_followers/${follower.id}/reminders`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(status, 200);
        assertResonator(body[0], resonator);
    });

    it('get a single follower resonator', async () => {
        const {userLogin, follower, resonator} = await generateFixtures().preset1();

        const {status, body} = await supertestWrapper({
            method: 'get',
            url: `/leader_followers/${follower.id}/reminders/${resonator.id}`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(status, 200);
        assertResonator(body, resonator);
    });

    it('create resonator', async () => {
        const { userLogin, leader, clinic, follower } = await generateFixtures().preset1();

        const resonator = {
            title: 'title',
            content: 'content',
            description: 'description',
            disable_copy_to_leader: true,
            follower_id: follower.id,
            link: 'link',
            pop_email: true,
            pop_time: "2017-02-12T11:06:47.255Z",
            repeat_days: [1,2,3]
        };

        const {status, body} = await supertestWrapper({
            method: 'post',
            url: `/leader_followers/${follower.id}/reminders`,
            body: resonator,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(status, 201);
        assertResonator(body, {
            ...resonator,
            id: body.id,
            leader_id: leader.id
        });

        assert.lengthOf(body.id, 36);
        assert.isOk(body.created_at);
        assert.isOk(body.updated_at);
    });

    it('put resonator', async () => {
        const { userLogin, follower, resonator } = await generateFixtures().preset1();

        const updatedResonator = {
            title: 'title2',
            content: 'content2',
            description: 'description2',
            disable_copy_to_leader: true,
            follower_id: putFollower.id,
            link: 'link2',
            pop_email: true,
            pop_time: "2017-02-12T11:06:47.255Z",
            repeat_days: [1,2,3]
        };

        const {status, body} = await supertestWrapper({
            method: 'put',
            url: `/leader_followers/${follower.id}/reminders/${resonator.id}`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(status, 200);
        assertResonator(body, resonator);
        assert.isOk(body.created_at);
        assert.isOk(body.updated_at);
    });

    it('add resonator criteria', async () => {
        const { userLogin, leader, clinic, follower, resonator } = await generateFixtures().preset1();
        const [ question ] = await generateFixtures().generateQuestion({
            leader, clinic
        }).done();

        const response = await supertestWrapper({
            method: 'post',
            url: `/leader_followers/${follower.id}/reminders/${resonator.id}/criteria`,
            cookie: `loginId=${userLogin.id}`,
            body: {
                question_id: question.id,
                reminder_id: resonator.id
            }
        });

        assert.equal(response.status, 200);

        const response2 = await supertestWrapper({
            method: 'get',
            url: `/leader_followers/${follower.id}/reminders/${resonator.id}`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(response2.status, 200);

        assertResonator(_.omit(response2.body, 'questions'), _.omit(resonator, 'questions'));

        const newQuestion = response2.body.questions[0];

        assertResonatorQuestions(
            response2.body.questions,
            [{
                id: newQuestion.id,
                question,
                question_id: question.id,
                resonator_id: resonator.id,
                removed: null
            }].concat(resonator.questions)
        );
    });

    it('remove resonator criteria', async () => {
        const { userLogin, follower, resonator } = await generateFixtures().preset1();

        const response = await supertestWrapper({
            method: 'delete',
            url: `/leader_followers/${follower.id}/reminders/${resonator.id}/criteria/${resonator.questions[0].id}`,
            cookie: `loginId=${userLogin.id}`,
        });

        assert.equal(response.status, 200);

        const {body: updatedResonator} = await supertestWrapper({
            method: 'get',
            url: `/leader_followers/${follower.id}/reminders/${resonator.id}`,
            cookie: `loginId=${userLogin.id}`
        });

        assertResonator(_.omit(updatedResonator, 'questions'), _.omit(resonator, 'questions'));
        assertResonatorQuestions(updatedResonator.questions, []);
    });

    it('add resonator image', async () => {
        const { userLogin, follower, resonator } = await generateFixtures().preset1();

        const attachment = {
            kind: 'image/png',
            path: path.resolve(__dirname, '../image.jpg')
        };

        const fields = {
            follower_id: follower.id,
            reminder_id: resonator.id,
            media_kind: 'image',
            media_title: 'image title'
        };

        const response = await supertestWrapper({
            method: 'post',
            url: `/leader_followers/${follower.id}/reminders/${resonator.id}/items`,
            cookie: `loginId=${userLogin.id}`,
            fields,
            attachment
        });

        assert.equal(response.status, 201);

        const updatedResonatorResponse = await supertestWrapper({
            method: 'get',
            url: `/leader_followers/${follower.id}/reminders/${resonator.id}`,
            cookie: `loginId=${userLogin.id}`
        });

        const newItem = updatedResonatorResponse.body.items[0];

        assert.lengthOf(newItem.id, 36);

        assertResonator(updatedResonatorResponse.body,
                        {
                            ...resonator,
                            items: [{
                                id: newItem.id,
                                resonator_id: resonator.id,
                                media_kind: 'image',
                                link: null,
                                media_format: null,
                                media_id: null,
                                owner_id: null,
                                owner_role: null,
                                title: 'image title',
                                visible: 1
                            }].concat(resonator.items)
                        });
    });

    it('remove resonator item', async () => {
        const { userLogin, follower, resonator } = await generateFixtures().preset1();

        const item = resonator.items[0]

        const deleteResponse = await supertestWrapper({
            method: 'delete',
            url: `/leader_followers/${follower.id}/reminders/${resonator.id}/items/${item.id}`,
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(deleteResponse.status, 200);

        const getResponse = await supertestWrapper({
            method: 'get',
            url: `/leader_followers/${follower.id}/reminders/${resonator.id}`,
            cookie: `loginId=${userLogin.id}`
        });

        assertResonator(getResponse.body, {
            ...resonator,
            items: resonator.items.filter(i => i.id !== item.id)
        });
    });
});

function assertResonator(actual, expected) {
    const repeat_days = expected.repeat_days.constructor.name === 'Array' ?
        expected.repeat_days :
        expected.repeat_days.split(',').map(d => parseInt(d));

    assert.deepEqual(_.omit(actual, 'created_at', 'updated_at', 'items', 'questions'), {
        ..._.omit(expected, 'items', 'questions', 'last_pop_time', 'pop_email', 'pop_location_lat', 'pop_location_lng', 'pop_time'),
        repeat_days
    });

    assert.deepEqual(actual.items.map(ra => _.omit(ra, 'created_at', 'updated_at')),
                     expected.items || []);

    assertResonatorQuestions(actual.questions, expected.questions);
}

function assertResonatorQuestions(q1 = [], q2 = []) {
    assert.deepEqual(q1.map(
        q => _.omit(q, 'created_at', 'updated_at')).map(q => ({
            ...q,
            question: _.omit(q.question, 'created_at', 'updated_at')
        })),
        q2.map(q => ({
            ...q,
            question: {
                ...q.question,
                answers: q.question.answers.map(a => _.omit(a, 'question_id'))
            }
        })));
}
