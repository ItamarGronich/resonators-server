import _ from 'lodash';
import app from '../../src/api/index';
import request from 'supertest';
import {users, followers} from '../../src/db/sequelize/models';
import {fooUserLogin, bazUserLogin} from '../dbFixtures/user_logins';
import {fooLeader, bazLeader} from '../dbFixtures/leaders';
import {putFollower} from '../dbFixtures/followers';
import {putUser} from '../dbFixtures/users';
import {clinic} from '../dbFixtures/clinics';
import setLoginCookie from './setLoginCookie';
import * as dbToDomain from '../../src/db/dbToDomain';
import {assert} from 'chai';
import bcrypt from 'bcrypt';

describe('leader_followers', () => {
    it('get followers', done => {
        request(app)
        .get('/leader_followers')
        .set(...setLoginCookie(fooUserLogin.id))
        .end((err, res) => {
            if (err) return done(err);

            assert.deepEqual(res.body.map(f => _.omit(f, 'updated_at', 'created_at')), [{
                id: '37d097a3-5397-4424-bdfb-0aebed7bafaa',
                user_id: '57394531-d688-463d-8460-b8642bc70bc8',
                clinic_id: '0a2f1d72-0b4b-4a21-9873-bae07a2ea3e3',
                leader_id: '076123b9-4d90-4272-8f64-23c2d1de9057',
                status: 1,
                user: {
                    country: null,
                    email: 'bar@baz.com',
                    name: 'bar',
                    unsubscribed: null
                }
            }]);

            assert.isOk(res.body[0].created_at);
            assert.isOk(res.body[0].updated_at);

            done();
        });
    });

    it('add follower', done => {
        request(app)
        .post('/leader_followers')
        .set(...setLoginCookie(bazUserLogin.id))
        .send({clinic_id: clinic.id, email: 'newfollower@bar.baz', name: 'new follower', password: '1111'})
        .expect(201)
        .expect(res => {
            assert.lengthOf(res.body.id, 36);
            assert.lengthOf(res.body.user_id, 36);
            assert.equal(res.body.clinic_id, clinic.id);
            assert.equal(res.body.leader_id, bazLeader.id);
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
            })
            .catch(done);
        })
        .end(done);
    });

    // it.skip('canot put unfollowed user');

    it('put follower', done => {
        request(app)
        .put(`/leader_followers/${putFollower.id}`)
        .set(...setLoginCookie(bazUserLogin.id))
        .send({user: {email: 'uv@gmail.com', name:'ppp'}})
        .expect(200)
        .expect(res => {
            return users.findById(putUser.id)
            .then(row => {
                const user = dbToDomain.toUser(row);
                assert.deepEqual(user, {
                    ...putUser,
                    country: null,
                    unsubscribed: null,
                    email: 'uv@gmail.com',
                    name: 'ppp'
                });
            })
            .catch(done);
        }).end(done)
    });
});
