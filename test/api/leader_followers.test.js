import _ from 'lodash';
import {users, followers} from '../../src/db/sequelize/models';
import {fooUserLogin} from '../dbFixtures/user_logins';
import {putFollower} from '../dbFixtures/followers';
import {clinic} from '../dbFixtures/clinics';
import setLoginCookie from './setLoginCookie';
import * as dbToDomain from '../../src/db/dbToDomain';
import {assert} from 'chai';
import bcrypt from 'bcrypt';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import request from './supertestWrapper';
import {getFollowers, freezeFollower, unfreezeFollower} from './calls';

describe('leader_followers', () => {
    it('get followers', async () => {
        const { user, userLogin, leader, clinic, follower } = await generateFixtures().preset1();

        const {status, body} = await getFollowers(userLogin.id);

        assert.equal(status, 200);

        assert.deepEqual(body.map(f => _.omit(f, 'updated_at', 'created_at')), [{
            id: follower.id,
            user_id: follower.user.id,
            clinic_id: clinic.id,
            leader_id: leader.id,
            status: 1,
            frozen: false,
            user: {
                country: null,
                email: follower.user.email,
                name: follower.user.name,
                unsubscribed: null
            }
        }]);

        assert.isOk(body[0].created_at);
        assert.isOk(body[0].updated_at);
    });

    it('add follower', async () => {
        const { user, userLogin, leader, clinic } = await generateFixtures().preset1();

        const {status, body} = await request({
            method: 'post',
            url: '/api/leader_followers',
            cookie: `loginId=${userLogin.id}`,
            body: {
                clinic_id: clinic.id,
                email: 'newfollower@bar.baz',
                name: 'new follower',
                password: '1111'
            }
        });
        assert.equal(status, 201);
        assert.lengthOf(body.id, 36);
        assert.lengthOf(body.user_id, 36);
        assert.equal(body.clinic_id, clinic.id);
        assert.equal(body.leader_id, leader.id);
        assert.equal(body.status, 2);
        assert.isOk(body.user, 'did not return the follower\'s user data');
        assert.isOk(body.user.name);
        assert.isOk(body.user.email);

        const dbUser = await users.findById(body.user_id);
        const password = dbUser.get('pass');
        const salt = dbUser.get('salt');
        assert.equal(password, bcrypt.hashSync('1111', salt));
        const dbFollower = await followers.findById(body.id);
        assert.equal(dbFollower.get('user_id'),
                     body.user_id,
                     'inserted user_id doesn\'t match!');
    });

    it('cannot put unfollowed user', async () => {
        const {status, body} = await request({
            method: 'put',
            url: `/api/leader_followers/${putFollower.id}`,
            cookie: `loginId=${fooUserLogin.id}`,
            body: {user: {email: 'uv@gmail.com', name:'ppp'}}
        });

        assert.equal(status, 403);
    });

    it('put follower', async () => {
        const { user, userLogin, leader, follower } = await generateFixtures().preset1();

        const {status, body} = await request({
            method: 'put',
            url: `/api/leader_followers/${follower.id}`,
            body: {user: {email: 'uv@gmail.com', name:'ppp'}},
            cookie: `loginId=${userLogin.id}`
        });

        assert.equal(status, 200);

        const row = await users.findById(follower.user.id)
        const dbUser = dbToDomain.toUser(row);
        assert.deepEqual(dbUser, {
            ...follower.user,
            country: null,
            unsubscribed: null,
            email: 'uv@gmail.com',
            name: 'ppp'
        });
    });

    describe('delete follower', () => {
        let userLogin, follower, status, body;

        before(async () => {
            ({ userLogin, follower } = await generateFixtures().preset1());

            ({status, body} = await request({
                method: 'delete',
                url: `/api/leader_followers/${follower.id}`,
                authorization: userLogin.id
            }));
        });

        it('status 200', () => {
            assert.equal(status, 200);
        });

        it('leader has no followers', async () => {
            const {body} = await request({
                method: 'get',
                url: `/api/leader_followers`,
                authorization: userLogin.id
            });

            assert.lengthOf(body, 0);
        });

        it('follower\'s resonator has been deleted', async () => {
            const {status, body} = await request({
                method: 'get',
                url: `/api/leader_followers/${follower.id}/reminders`,
                authorization: userLogin.id
            });

            assert.equal(status, 200);

            assert.lengthOf(body, 0);
        });
    });

    describe('disable follower', () => {
        let userLogin, follower, status, body;

        before(async () => {
            ({ userLogin, follower } = await generateFixtures().preset1());
            ({status, body} = await freezeFollower(userLogin.id, follower.id));
        });

        it('status 200', () => {
            assert.equal(status, 200);
        });

        it('follower should be marked with the frozen status', async () => {
            const f = await getFollower(follower.id);
            assert.isTrue(f.frozen);
        });

        it('unfreeze follower', async () => {
            const {status, body} = await unfreezeFollower(userLogin.id, follower.id);
            assert.equal(status, 200);

            const f = await getFollower(follower.id);
            assert.isFalse(f.frozen);
        });

        async function getFollower(id) {
            const {body} = await getFollowers(userLogin.id);
            return _.find(body, f => f.id === id);
        }
    });
});
