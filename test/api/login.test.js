import _ from 'lodash';
import db from '../../src/db/sequelize/dbConnection';
import {assert} from 'chai';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import supertestWrapper from '../api/supertestWrapper';
import moment from 'moment';
const knex = require('knex')({client: 'postgres'});

describe('login', () => {
    it('login without credentials', async () => {
        const {status, body} = await supertestWrapper({
            method: 'post',
            url: '/user_sessions'
        });

        assert.equal(status, 200);

        assert.deepEqual(body, {});
    });

    describe('successful login', () => {
        let userLogin, status, body, headers;

        beforeEach(async () => {
            ([userLogin] = await generateFixtures()
                                .generateUserLogin()
                                .done());

            ({status, body, headers} = await supertestWrapper({
                method: 'post',
                url: '/user_sessions',
                body: { email: userLogin.user.email, password: '1234'}
            }));
        });

        it('status 200', () => {
            assert.equal(status, 200);
        });

        it('respond with the user info', () => {
            assert.deepEqual(_.omit(body, 'expires_at', 'auth_token'), {
                email: userLogin.user.email,
                name: userLogin.user.name,
                country: null,
                unsubscribed: null
            });
        });

        it('set cookie', () => {
            assert(moment(body.expires_at) > moment(), `expires_at (${body.expires_at}) must be in the future.`);

            assert.match(headers['set-cookie'][0],
                         /loginId=.+; Max\-Age=\d+;/,
                         'set cookie match failed');
        });

        it('respond with auth token', () => {
            assert.isOk(body.auth_token);
        });
    });

    it('relogin with cookie', async () => {
        const [userLogin] = await generateFixtures()
        .generateUserLogin()
        .done();

        const {status, body, headers} = await supertestWrapper({
            method: 'post',
            url: '/user_sessions',
            body: { email: userLogin.user.email, password: '1234'},
        });

        const matches = /loginId=(.+?);/.exec(headers['set-cookie'][0]);
        const loginId = matches[1];

        const getResponse = await supertestWrapper({
            method: 'get',
            url: '/user_sessions',
            cookie: `loginId=${loginId}`
        });

        assert.equal(getResponse.status, 200);
        assert.deepEqual(_.omit(getResponse.body, 'expires_at', 'auth_token'), {
            name: userLogin.user.name,
            email: userLogin.user.email,
            unsubscribed: null,
            country: null
        });
    });

    it('relogin with token specified in the authorization header', async () => {
        const [userLogin] = await generateFixtures()
        .generateUserLogin()
        .done();

        const getResponse = await supertestWrapper({
            method: 'get',
            url: '/user_sessions',
            authorization: userLogin.id
        });

        assert.equal(getResponse.status, 200);
        assert.deepEqual(_.omit(getResponse.body, 'expires_at', 'auth_token'), {
            name: userLogin.user.name,
            email: userLogin.user.email,
            unsubscribed: null,
            country: null
        });
    });

    it('relogin without cookie', async () => {
        const {status, body} = await supertestWrapper({
            method: 'get',
            url: '/user_sessions'
        });

        assert.equal(status, 200);
        assert.deepEqual(body, {});
    });

    it('failed login', async () => {
        const [userLogin] = await generateFixtures()
                            .generateUserLogin()
                            .done();

        const {status, body, headers} = await supertestWrapper({
            method: 'post',
            url: '/user_sessions',
            body: { email: userLogin.user.email, password: '12345'}
        });

        assert.equal(status, 200);
        assert.deepEqual(body, {});

        const cookies = headers['set-cookie'];

        if (cookies) {
            cookies.forEach(cookie => {
                assert(cookie.indexOf('loginId') === -1,
                       'loginId was present in a cookie - it should not!');
            });
        }
    });

    it('successful login - insert into UserLogin', async () => {
        const [userLogin] = await generateFixtures()
                            .generateUserLogin()
                            .done();


        const {status, body} = await supertestWrapper({
            method: 'post',
            url: '/user_sessions',
            body: { email: userLogin.user.email, password: '1234'}
        });

        const sql = knex('users')
        .join('user_logins', 'users.id', 'user_logins.user_id')
        .where('users.email', userLogin.user.email)
        .toString();

        await db.query(sql).spread(rows => assert.isAbove(rows.length, 0))
    })
});
