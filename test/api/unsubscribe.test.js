import _ from 'lodash';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {users} from '../../src/db/sequelize/models';
import {assert} from 'chai';
import {unsubscribe} from './calls';
import uuid from 'uuid/v4';

describe('unsubscribe', () => {
    it('save it in the db correctly', async () => {
        const {userLogin, resonator} = await generateFixtures().preset1();
        const userId = userLogin.user.id;

        const response = await unsubscribe(userId);

        assert.equal(response.status, 200);
        assert.equal(response.text, 'You have been unsubscribed from the Resonators system.');

        const row = await users.findById(userId);
        assert.isTrue(row.unsubscribed);
    });
});
