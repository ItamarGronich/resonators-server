import _ from 'lodash';
import app from '../../src/api/index';
import request from 'supertest';
import {fooUserLogin, bazUserLogin} from '../dbFixtures/user_logins';
import {barFollower} from '../dbFixtures/followers';
import setLoginCookie from './setLoginCookie';
import {assert} from 'chai';
import moment from 'moment';

describe.only('reminders', () => {
    it('block unauthorized leader', (done) => {
        request(app)
        .get(`/leader_followers/${barFollower.id}/reminders`)
        .set(...setLoginCookie(bazUserLogin.id))
        .end((err, res) => {
            if (err) return done(err);

            assert.equal(res.status, 403);

            assert.deepEqual(res.body, {
                status: 'leader is not permitted to view or edit the given follower.'
            });

            done();
        });
    });

    it('get followers\' resonators', done => {
        request(app)
        .get(`/leader_followers/${barFollower.id}/reminders`)
        .set(...setLoginCookie(fooUserLogin.id))
        .end((err, res) => {
            if (err) return done(err);

            const resonators = res.body;

            assert.deepEqual(resonators, [{
                id: '2f4b901a-1c9d-4705-8229-52bd9ada3ade',
                leader_id: '076123b9-4d90-4272-8f64-23c2d1de9057',
                follower_id: '37d097a3-5397-4424-bdfb-0aebed7bafaa',
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

            done();
        });
    });
});
