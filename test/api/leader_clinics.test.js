import app from '../../src/api/index';
import request from 'supertest';
import setLoginCookie from './setLoginCookie';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';

describe('leader_clinics', () => {
    it('get clinics', async () => {
            const gen = generateFixtures().generateUserLogin();
            const user = gen.last().user;
            let [userLogin, leader, clinic] = await gen.generateLeader({user})
                                            .generateClinic({user})
                                            .done();

            await request(app)
            .get('/leader_clinics')
            .set(...setLoginCookie(userLogin.json.id))
            .expect(res => {
                assert.shallowDeepEqual(res.body, [{
                    id: clinic.json.id,
                    user_id: user.json.id,
                    name: clinic.json.name,
                }]);

                assert.isOk(res.body[0].created_at);
                assert.isOk(res.body[0].updated_at);
            });
    });
});
