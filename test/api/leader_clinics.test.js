import app from '../../src/api/index';
import request from 'supertest';
import setLoginCookie from './setLoginCookie';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';

describe('leader_clinics', () => {
    it('get clinics', async () => {
            const { user, userLogin, clinic } = await generateFixtures().preset1();

            await request(app)
            .get('/leader_clinics')
            .set(...setLoginCookie(userLogin.id))
            .expect(res => {
                assert.shallowDeepEqual(res.body, [{
                    id: clinic.id,
                    user_id: user.id,
                    name: clinic.name,
                }]);

                assert.isOk(res.body[0].created_at);
                assert.isOk(res.body[0].updated_at);
            });
    });
});
