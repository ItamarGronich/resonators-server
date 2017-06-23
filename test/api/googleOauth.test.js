import _ from 'lodash';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {google_accounts} from '../../src/db/sequelize/models';
import {assert} from 'chai';
import {startGoogleAuth, endGoogleAuth} from './calls';
import uuid from 'uuid/v4';

describe('google oauth', () => {
    it('start oauth process - first time', async () => {
        const {user} = await generateFixtures().preset1();

        const response = await startGoogleAuth(user.id);

        assert.equal(response.status, 200);

        const {url} = response.body;

        assertOauthRedirectUrl(url, user.id);
        assert.include(url, '&prompt=consent', 'must include a consent prompt for first time auth (for getting the refresh_token)');
    });

    it('start oauth process - not first time', async () => {
        const {user} = await generateFixtures().preset1();
        await generateFixtures().generateGoogleAccount({ user_id: user.id});

        const response = await startGoogleAuth(user.id);

        assert.equal(response.status, 200);

        const {url} = response.body;

        assertOauthRedirectUrl(url, user.id);
        assert.notInclude(url, '&prompt=consent', 'must not include the consent prompt for users with existing google accounts');
    });

    it('end oauth process - first time auth', async () => {
        const {userLogin, resonator} = await generateFixtures().preset1();
        const userId = userLogin.user.id;
        const code = 'authCodeFromGoogle';

        const response = await endGoogleAuth(userId, code);

        assert.equal(response.status, 200);

        const account = (await google_accounts.findOne({where: {user_id: userId}})).toJSON();
        assert.equal(account.user_id, userId);
        assert.isOk(account.access_token);
        assert.isOk(account.access_token_expiry_date);
        assert.isOk(account.id_token);
        assert.isOk(account.refresh_token);
        assert.isOk(account.id);
        assert.isOk(account.createdAt);
        assert.isOk(account.updatedAt);
    });

    it('end oauth process - reucurring auth', async () => {
        const {userLogin, resonator} = await generateFixtures().preset1();
        const userId = userLogin.user.id;
        const [googleAccount] = await generateFixtures().generateGoogleAccount({user_id: userId}).done();
        const code = 'authCodeFromGoogle';

        const response = await endGoogleAuth(userId, code);

        assert.equal(response.status, 200);

        const account = (await google_accounts.findOne({where: {user_id: userId}})).toJSON();
        assert.equal(account.user_id, userId);
        assert.equal(account.id, googleAccount.id);
        assert.notEqual(account.access_token, googleAccount.access_token);
        assert.notEqual(account.id_token, googleAccount.id_token);
        assert.isOk(account.refresh_token, googleAccount.refresh_token);
    });

    function assertOauthRedirectUrl(url, userId) {
        assert.match(url, /^https:\/\/accounts.google.com/, 'the redirect url should go to Google');
        assert.include(url, encodeURIComponent('/confirmGoogleAuth'), 'url should include our callback url');
        assert.include(url, userId, 'url should include the user id');
    }
});
