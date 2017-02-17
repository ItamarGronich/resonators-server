import setLoginCookie from './setLoginCookie';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';
import supertestWrapper from '../api/supertestWrapper';

describe('leader_clinics', () => {
    it('get clinics', async () => {
        const { user, userLogin, clinic } = await generateFixtures().preset1();

        const response = await supertestWrapper({
            method: 'get',
            url: '/leader_clinics',
            cookie: `loginId=${userLogin.id}`
        });

        assert.shallowDeepEqual(response.body, [{
            id: clinic.id,
            user_id: user.id,
            name: clinic.name
        }]);

        assert.isOk(response.body[0].created_at);
        assert.isOk(response.body[0].updated_at);
    });
});
