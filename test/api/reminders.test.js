import _ from 'lodash';
import app from '../../src/api/index';
import request from 'supertest';
import {fooUserLogin} from '../dbFixtures/user_logins';
import {putFollower} from '../dbFixtures/followers';
import {resonator} from '../dbFixtures/resonators';
import {bazLeader} from '../dbFixtures/leaders';
import setLoginCookie from './setLoginCookie';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';
import moment from 'moment';

describe('reminders', () => {
    it('block unauthorized leader', async() => {
        const { userLogin, follower } = await generateFixtures().preset1();

        await request(app)
        .get(`/leader_followers/${follower.id}/reminders`)
        .set(...setLoginCookie(fooUserLogin.id))
        .expect(403)
        .expect(res => {
            assert.deepEqual(res.body, {
                status: 'leader is not permitted to view or edit the given follower.'
            });
        });
    });

    it('get followers\' resonators', async done => {
        const { userLogin, leader, clinic, follower, resonator } = await generateFixtures().preset1();

        request(app)
        .get(`/leader_followers/${follower.id}/reminders`)
        .set(...setLoginCookie(userLogin.id))
        .expect(200)
        .expect(res => {
        })
        .then(() => done())
        .catch(done);
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

        await request(app)
        .post(`/leader_followers/${follower.id}/reminders`)
        .set(...setLoginCookie(userLogin.id))
        .send(resonator)
        .expect(201)
        .expect(res => {
            assertResonator(res.body, {
                ...resonator,
                id: res.body.id,
                leader_id: leader.id
            });

            assert.lengthOf(res.body.id, 36);
            assert.isOk(res.body.created_at);
            assert.isOk(res.body.updated_at);
        });
    });

    it('put resonator', async () => {
        const { userLogin, leader, clinic, follower, resonator } = await generateFixtures().preset1();

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

        await request(app)
        .put(`/leader_followers/${follower.id}/reminders/${resonator.id}`)
        .set(...setLoginCookie(userLogin.id))
        .send(updatedResonator)
        .expect(200)
        .expect(res => {
            assertResonator(res.body, resonator);
            assert.isOk(res.body.created_at);
            assert.isOk(res.body.updated_at);
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

    assert.deepEqual((actual.questions || []).map(
        q => _.omit(q, 'created_at', 'updated_at')),
        (expected.questions || []).map(q => ({
            ...q,
            question: {
                ...q.question,
                answers: q.question.answers.map(a => _.omit(a, 'question_id'))
            }
        })));
}
