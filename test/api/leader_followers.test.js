import _ from 'lodash';
import app from '../../src/api/index';
import request from 'supertest';
import {users, followers} from '../../src/db/sequelize/models';
import {fooUserLogin} from '../dbFixtures/user_logins';
import {putFollower} from '../dbFixtures/followers';
import {clinic} from '../dbFixtures/clinics';
import setLoginCookie from './setLoginCookie';
import * as dbToDomain from '../../src/db/dbToDomain';
import {assert} from 'chai';
import bcrypt from 'bcrypt';
import generateFixtures from '../dbFixtures/fixtureGenerator';

describe('leader_followers', () => {
    it('get followers', async () => {
        const { user, userLogin, leader, clinic, follower } = await generateFixtures().preset1();

        await request(app)
        .get('/leader_followers')
        .set(...setLoginCookie(userLogin.id))
        .expect((res) => {
            assert.deepEqual(res.body.map(f => _.omit(f, 'updated_at', 'created_at')), [{
                id: follower.id,
                user_id: follower.user.id,
                clinic_id: clinic.id,
                leader_id: leader.id,
                status: 1,
                user: {
                    country: null,
                    email: follower.user.email,
                    name: follower.user.name,
                    unsubscribed: null
                }
            }]);

            assert.isOk(res.body[0].created_at);
            assert.isOk(res.body[0].updated_at);
        });
    });

    it('add follower', async (done) => {
        const { user, userLogin, leader, clinic } = await generateFixtures().preset1();

        request(app)
        .post('/leader_followers')
        .set(...setLoginCookie(userLogin.id))
        .send({clinic_id: clinic.id, email: 'newfollower@bar.baz', name: 'new follower', password: '1111'})
        .expect(201)
        .expect(res => {
            assert.lengthOf(res.body.id, 36);
            assert.lengthOf(res.body.user_id, 36);
            assert.equal(res.body.clinic_id, clinic.id);
            assert.equal(res.body.leader_id, leader.id);
            assert.equal(res.body.status, 2);

            return users.findById(res.body.user_id)
            .then(dbUser => {
                const password = dbUser.get('pass');
                const salt = dbUser.get('salt');
                assert.equal(password, bcrypt.hashSync('1111', salt));
            })
            .then(() => followers.findById(res.body.id))
            .then(dbFollower => {
                assert.equal(dbFollower.get('user_id'),
                             res.body.user_id,
                             'inserted user_id doesn\'t match!');
            });
        })
        .end(done);
    });

    it('cannot put unfollowed user', done => {
        request(app)
        .put(`/leader_followers/${putFollower.id}`)
        .set(...setLoginCookie(fooUserLogin.id))
        .send({user: {email: 'uv@gmail.com', name:'ppp'}})
        .expect(403)
        .end(done);
    });

    it('put follower', async done => {
        const { user, userLogin, leader, follower } = await generateFixtures().preset1();

        request(app)
        .put(`/leader_followers/${follower.id}`)
        .set(...setLoginCookie(userLogin.id))
        .send({user: {email: 'uv@gmail.com', name:'ppp'}})
        .expect(200)
        .expect(res => {
            return users.findById(follower.user.id)
            .then(row => {
                const user = dbToDomain.toUser(row);
                assert.deepEqual(user, {
                    ...follower.user,
                    country: null,
                    unsubscribed: null,
                    email: 'uv@gmail.com',
                    name: 'ppp'
                });
            })
        }).end(done)
    });
});
