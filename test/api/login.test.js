import app from '../../src/api/index';
import db from '../../src/db/sequelize/dbConnection';
import request from 'supertest';
import {assert} from 'chai';
import generateFixtures from '../dbFixtures/fixtureGenerator';
const knex = require('knex')({});

describe('login', () => {
    it('login without credentials', done => {
        request(app)
            .post('/user_sessions')
            .expect(200, {loginResult: { isValid: false, user: null }}, done);
    });

    it('successful login', async () => {
        const [userLogin] = await generateFixtures()
                            .generateUserLogin()
                            .done();

         await request(app)
            .post('/user_sessions')
            .send({ email: userLogin.user.email, password: '1234'})
            .expect(200, {
                loginResult: {
                    isValid: true,
                    user: {
                        email: userLogin.user.email,
                        name: userLogin.user.name,
                        country: null,
                        unsubscribed: null
                    }
                }
            })
            .expect((res) => {
                assert.match(res.headers['set-cookie'][0],
                             /loginId=.+; Max\-Age=\d+;/,
                             'set cookie match failed');
            });
    });

    it('relogin with cookie', async done => {
        const [userLogin] = await generateFixtures()
                            .generateUserLogin()
                            .done();

        request(app)
            .post('/user_sessions')
            .send({ email: userLogin.user.email, password: '1234'})
            .end((err, res) => {
                if (err) return done(err);

                const matches = /loginId=(.+?);/.exec(res.headers['set-cookie'][0]);
                const loginId = matches[1];

                return request(app)
                    .get('/user_sessions')
                    .set('Cookie', [`loginId=${loginId}`])
                    .expect(200, {
                        loginResult: {
                            isValid: true,
                            user: {
                                name: userLogin.user.name,
                                email: userLogin.user.email,
                                unsubscribed: null,
                                country: null
                            }
                        }
                    }, done);
            });
    });

    it('relogin without cookie', done => {
        request(app)
            .get('/user_sessions')
            .expect(403, {
                status: 'Must be logged in for using this call.'
            }, done);
    });

    it('failed login', async done => {
        const [userLogin] = await generateFixtures()
                            .generateUserLogin()
                            .done();

        request(app)
            .post('/user_sessions')
            .send({ email: userLogin.user.email, password: '12345'})
            .expect(200, {
                loginResult: {
                    isValid: false,
                    user: null
                }
            })
            .expect((res) => {
                const cookies = res.headers['set-cookie'];

                if (cookies)
                    cookies.forEach(cookie => {
                        assert(cookie.indexOf('loginId') === -1,
                               'loginId was present in a cookie - it should not!');
                    });
            }).end(done);
    });

    it('successful login - insert into UserLogin', async done => {
        const [userLogin] = await generateFixtures()
                            .generateUserLogin()
                            .done();

        request(app)
        .post('/user_sessions')
        .send({ email: userLogin.user.email, password: '1234'})
        .expect((res) => {
            const sql = knex('users')
            .join('user_logins', 'users.id', 'user_logins.user_id')
            .where('users.email', userLogin.user.email)
            .toString();

            db.query(sql)
            .spread(rows => assert.isAbove(rows.length, 0))
        }).end(done);
    })
});
