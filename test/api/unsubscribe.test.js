import _ from 'lodash';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {users} from '../../src/db/sequelize/models';
import {assert} from 'chai';
import {unsubscribe, resubscribe} from './calls';

describe('unsubscribe', () => {
    it('save it in the db correctly', async () => {
        const {userLogin, resonator} = await generateFixtures().preset1();
        const userId = userLogin.user.id;

        const response = await unsubscribe(userId);

        assert.equal(response.status, 200);
        assert.equal(response.text, 'You have been unsubscribed from the Resonators system.');

        const row = await users.findByPk(userId);
        assert.isTrue(row.unsubscribed);
    });

    it('resubscribe', async () => {
        const {userLogin, resonator} = await generateFixtures().preset1();
        const userId = userLogin.user.id;

        const response = await unsubscribe(userId);
        const response2 = await resubscribe(userId);

        assert.equal(response2.status, 200);
        assert.equal(response2.text, 'You have been resubscribed to the Resonators system.');

        const row = await users.findByPk(userId);
        assert.isFalse(row.unsubscribed);
    });
});
