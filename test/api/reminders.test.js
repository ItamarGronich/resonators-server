import _ from 'lodash';
import app from '../../src/api/index';
import request from 'supertest';
import {fooUserLogin, bazUserLogin} from '../dbFixtures/user_logins';
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
            const resonators = res.body;

            assert.deepEqual(resonators.map(r => _.omit(r, 'created_at', 'updated_at', 'items', 'questions')), [{
                id: resonator.id,
                leader_id: leader.id,
                follower_id: follower.id,
                pop_email: false,
                pop_time: moment('2016-04-03 14:00:00').toISOString(),
                repeat_days: [1,2,3,4,5],
                disable_copy_to_leader: false,
                content: resonator.content,
                link: resonator.link,
                title: resonator.title,
                description: resonator.description
            }]);

            assert.deepEqual(resonators[0].items.map(ra => _.omit(ra, 'created_at', 'updated_at')), [{
                id: resonator.items[0].id,
                link: 'a link',
                title: 'an image',
                visible: true,
                media_format: 'png',
                media_id: 'media_id',
                owner_id: resonator.items[0].owner_id,
                owner_role: 'leader',
                resonator_id: resonator.id
            }]);

            assert.deepEqual(resonators[0].questions.map(q => _.omit(q, 'created_at', 'updated_at')), [{
                id: resonator.questions[0].id,
                question_id: resonator.questions[0].question.id,
                removed: resonator.questions[0].question.removed,
                resonator_id: resonator.id,
                question: {
                    id: resonator.questions[0].question.id,
                    clinic_id: clinic.id,
                    leader_id: leader.id,
                    question_kind: resonator.questions[0].question.question_kind,
                    description: resonator.questions[0].question.description,
                    title: resonator.questions[0].question.title,
                    removed: resonator.questions[0].question.removed,
                    answers: [{
                        ..._.omit(resonator.questions[0].question.answers[0], 'question_id')
                    }]
                }
            }]);
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
            follower_id: putFollower.id,
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
            assert.deepEqual(_.omit(res.body, 'id', 'created_at', 'updated_at'), {
                ...resonator,
                leader_id: leader.id,
                questions: [],
                items: []
            });

            assert.lengthOf(res.body.id, 36);
            assert.isOk(res.body.created_at);
            assert.isOk(res.body.updated_at);
        });
    });

    // it('put resonator', done => {
    //     const resonator = {
    //         title: 'title2',
    //         content: 'content2',
    //         description: 'description2',
    //         disable_copy_to_leader: true,
    //         follower_id: putFollower.id,
    //         link: 'link2',
    //         pop_email: true,
    //         pop_time: "2017-02-12T11:06:47.255Z",
    //         repeat_days: [1,2,3]
    //     };
    //
    //     request(app)
    //     .post(`/leader_followers/${putFollower.id}/reminders`)
    //     .set(...setLoginCookie(bazUserLogin.id))
    //     .send(resonator)
    //     .expect(201)
    //     .expect(res => {
    //         assert.deepEqual(_.omit(res.body, 'id', 'created_at', 'updated_at'), {
    //             ...resonator,
    //             leader_id: bazLeader.id,
    //             questions: [],
    //             items: []
    //         });
    //
    //         assert.lengthOf(res.body.id, 36);
    //         assert.isOk(res.body.created_at);
    //         assert.isOk(res.body.updated_at);
    //     })
    //     .end(done);
    // });
});
