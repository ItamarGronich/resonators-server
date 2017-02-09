import _ from 'lodash';
import app from '../../src/api/index';
import request from 'supertest';
import {fooUserLogin} from '../dbFixtures/user_logins';
import setLoginCookie from './setLoginCookie';
import {assert} from 'chai';

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
});
