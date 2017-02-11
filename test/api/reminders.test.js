import _ from 'lodash';
import app from '../../src/api/index';
import request from 'supertest';
import {fooUserLogin, bazUserLogin} from '../dbFixtures/user_logins';
import {fooUser} from '../dbFixtures/users';
import {barFollower} from '../dbFixtures/followers';
import {resonator} from '../dbFixtures/resonators';
import {fooLeader} from '../dbFixtures/leaders';
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

            assert.deepEqual(resonators.map(r => _.omit(r, 'created_at', 'updated_at', 'resonator_attachments')), [{
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

            assert.deepEqual(resonators[0].resonator_attachments.map(ra => _.omit(ra, 'created_at', 'updated_at')), [{
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
        })
        .then(() => done())
        .catch(done);
    });
});
