import app from '../../src/api/index';
import {user_logins as UserLogin} from '../../src/db/sequelize/models';
import db from '../../src/db/sequelize/dbConnection';
import request from 'supertest';
import {assert} from 'chai';
const knex = require('knex')({});

describe('login', () => {
    it('login without credentials', done => {
        request(app)
            .post('/user_sessions')
            .expect(200, {loginResult: { isValid: false, user: null }}, done);
    });

    it('successful login', done => {
        request(app)
            .post('/user_sessions')
            .send({ email: 'foo@bar.baz', password: '1234'})
            .expect(200, {
                loginResult: {
                    isValid: true,
                    user: {
                        email: 'foo@bar.baz',
                        name: 'foo',
                        country: null,
                        unsubscribed: null
                    }
                }
            })
            .end((err, res) => {
                if (err) return done(err);

                assert.match(res.headers['set-cookie'][0],
                             /loginId=.+; Max\-Age=\d+;/,
                             'set cookie match failed');

                done();
            });
    });

    it('relogin with cookie', done => {
        request(app)
            .post('/user_sessions')
            .send({ email: 'foo@bar.baz', password: '1234'})
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
                                name: 'foo',
                                email: 'foo@bar.baz',
                                unsubscribed: null,
                                country: null
                            }
                        }
                    }, done);
            });
    });

    it('failed login', done => {
        request(app)
            .post('/user_sessions')
            .send({ email: 'foo@bar.baz', password: '12345'})
            .expect(200, {
                loginResult: {
                    isValid: false,
                    user: null
                }
            })
            .end((err, res) => {
                if (err) return done(err);


                const cookies = res.headers['set-cookie'];

                if (cookies)
                    cookies.forEach(cookie => {
                        assert(cookie.indexOf('loginId') === -1,
                               'loginId was present in a cookie - it should not!');
                    });

                done();
            });
    });

    it('successful login - insert into UserLogin', done => {
        UserLogin.truncate()
        .then(() => {
            request(app)
                .post('/user_sessions')
                .send({ email: 'foo@bar.baz', password: '1234'})
                .end((err, res) => {
                    if (err) return done(err);

                    const sql = knex('users')
                                .join('user_logins', 'users.id', 'user_logins.user_id')
                                .where('users.email', 'foo@bar.baz')
                                .toString();

                    db.query(sql)
                        .spread(rows => assert.isAbove(rows.length, 0))
                        .then(done)
                        .catch(done);
                });
        }).catch(done);
    })
});
