import app from '../../src/api/index';
import request from 'supertest';

describe('login', () => {
    it('login without credentials', done => {
        request(app)
            .post('/user_sessions')
            .expect(200, {loginResult: { isValid: false, user: null }}, done)
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
});
