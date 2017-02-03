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
            }, done);
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
            }, done);
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
