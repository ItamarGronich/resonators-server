import request from './supertestWrapper';
import {assert} from 'chai';
import generateFixtures from '../dbFixtures/fixtureGenerator';

describe('serving', () => {
    it('index page includes the js script tag', async () => {
        await generateFixtures().generateVersionableAsset({
            asset_id: 'resonators-client',
            link: 'http://foo.bar.baz'
        });

        const response = await request({
            url: '/',
            method: 'get'
        });

        assert.equal(response.status, 200);
        assert.include(response.text, '<script type="text/javascript" src="http://foo.bar.baz"></script>')
    });
});
