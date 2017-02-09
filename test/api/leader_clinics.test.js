import app from '../../src/api/index';
import request from 'supertest';
import {fooUserLogin} from '../dbFixtures/user_logins';
import setLoginCookie from './setLoginCookie';
import {assert} from 'chai';

describe('leader_clinics', () => {
    it('get clinics', done => {
        request(app)
        .get('/leader_clinics')
        .set(...setLoginCookie(fooUserLogin.id))
        .end((err, res) => {
            if (err) return done(err);

            assert.shallowDeepEqual(res.body, [{
                id: '0a2f1d72-0b4b-4a21-9873-bae07a2ea3e3',
                user_id: '455f0d8c-64c8-49af-843d-a2a2b0bdb591',
                name: 'Foo\'s clinic',
            }]);

            assert.isOk(res.body[0].created_at);
            assert.isOk(res.body[0].updated_at);

            done();
        });
    });
});
