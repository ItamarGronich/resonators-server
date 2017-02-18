import _ from 'lodash';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';
import supertestWrapper from '../api/supertestWrapper';

describe('render resonator', () => {
    it('render resonator html', async () => {
        const { userLogin, resonator } = await generateFixtures().preset1();

        const response = await supertestWrapper({
            method: 'get',
            url: `/renderResonator/${resonator.id}`
        });

        assert.equal(response.status, 200);

        assert.include(response.text, resonator.title);
    });
});
