import _ from 'lodash';
import app from '../../src/api/index';
import request from 'supertest';
import {fooUserLogin, bazUserLogin} from '../dbFixtures/user_logins';
import {fooUser} from '../dbFixtures/users';
import {barFollower} from '../dbFixtures/followers';
import {resonator} from '../dbFixtures/resonators';
import {fooLeader} from '../dbFixtures/leaders';
import {question1} from '../dbFixtures/questions';
import {question1Answer1} from '../dbFixtures/answers';
import {resonatorQuestion1} from '../dbFixtures/resonator_questions';
import setLoginCookie from './setLoginCookie';
import {assert} from 'chai';
import moment from 'moment';

describe('reminders', () => {
    it('block unauthorized leader', (done) => {
        request(app)
        .get(`/leader_followers/${barFollower.id}/reminders`)
        .set(...setLoginCookie(bazUserLogin.id))
        .expect(403)
        .expect(res => {
            assert.deepEqual(res.body, {
                status: 'leader is not permitted to view or edit the given follower.'
            });
        })
        .then(() => done())
        .catch(done);
    });

    it('get followers\' resonators', done => {
        request(app)
        .get(`/leader_followers/${barFollower.id}/reminders`)
        .set(...setLoginCookie(fooUserLogin.id))
        .expect(200)
        .expect(res => {
            const resonators = res.body;

            assert.deepEqual(resonators.map(r => _.omit(r, 'created_at', 'updated_at', 'items', 'questions')), [{
                id: resonator.id,
                leader_id: fooLeader.id,
                follower_id: barFollower.id,
                pop_email: false,
                pop_location_lat: 1.5,
                pop_location_lng: 3.4,
                pop_time: moment('2016-04-03 14:00:00').toISOString(),
                repeat_days: '1,2,3,4,5',
                last_pop_time: null,
                disable_copy_to_leader: false,
                content: 'a content',
                link: 'a link',
                title: 'a title',
                description: 'a description'
            }]);

            assert.deepEqual(resonators[0].items.map(ra => _.omit(ra, 'created_at', 'updated_at')), [{
                id: 'c3f264e1-0550-45e9-8a8f-357656ae7d49',
                link: 'a link',
                title: 'an image',
                visible: true,
                media_format: 'png',
                media_id: 'media_id',
                owner_id: fooUser.id,
                owner_role: 'leader',
                resonator_id: resonator.id
            }]);

            assert.deepEqual(resonators[0].questions.map(q => _.omit(q, 'created_at', 'updated_at')), [{
                id: resonatorQuestion1.id,
                question_id: question1.id,
                removed: resonatorQuestion1.removed,
                resonator_id: resonator.id,
                question: {
                    id: question1.id,
                    clinic_id: question1.clinic_id,
                    leader_id: question1.leader_id,
                    question_kind: question1.question_kind,
                    description: question1.description,
                    title: question1.title,
                    removed: question1.removed,
                    answers: [{
                        id: question1Answer1.id,
                        body: question1Answer1.body,
                        rank: question1Answer1.rank
                    }]
                }
            }]);
        })
        .then(() => done())
        .catch(done);
    });
});
