import db from '../../src/db/sequelize/dbConnection';
import {assert} from 'chai';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import supertestWrapper from '../api/supertestWrapper';
const knex = require('knex')({});

describe('login', () => {
    it('login without credentials', async () => {
        const {status, body} = await supertestWrapper({
            method: 'post',
            url: '/user_sessions'
        });

        assert.equal(status, 200);

        assert.deepEqual(body, {
            loginResult: {
                isValid: false,
                user: null
            }
        });
    });

    it('successful login', async () => {
        const [userLogin] = await generateFixtures()
                            .generateUserLogin()
                            .done();

        const {status, body, headers} = await supertestWrapper({
            method: 'post',
            url: '/user_sessions',
            body: { email: userLogin.user.email, password: '1234'}
        });

        assert.equal(status, 200);
        assert.deepEqual(body, {
            loginResult: {
                isValid: true,
                user: {
                    email: userLogin.user.email,
                    name: userLogin.user.name,
                    country: null,
                    unsubscribed: null
                }
            }
        });

        assert.match(headers['set-cookie'][0],
                     /loginId=.+; Max\-Age=\d+;/,
                     'set cookie match failed');
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
        assert.deepEqual(getResponse.body, {
            loginResult: {
                isValid: true,
                user: {
                    name: userLogin.user.name,
                    email: userLogin.user.email,
                    unsubscribed: null,
                    country: null
                }
            }
        });
    });

    it('relogin without cookie', async () => {
        const {status, body} = await supertestWrapper({
            method: 'get',
            url: '/user_sessions'
        });

        assert.equal(status, 403);
        assert.deepEqual(body, {
            status: 'Must be logged in for using this call.'
        });
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
        assert.deepEqual(body, {
            loginResult: {
                isValid: false,
                user: null
            }
        });

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
