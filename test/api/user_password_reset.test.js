import request from './supertestWrapper';
import {assert} from 'chai';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import sendResetPasswordEmail from '../../src/application/sendResetPasswordEmail';
import {user_password_resets} from '../../src/db/sequelize/models';
import uuid from 'uuid/v4';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('password reset', () => {
    it('send reset password request - success', async () => {
        const [user] = await generateFixtures().generateUser().done();

        const response = await request({
            url: '/user_password_resets',
            method: 'post',
            body: {
                email: user.email
            }
        });

        assert.equal(response.status, 200);
    });

    it('send reset password request - email does not exist', async () => {
        const [user] = await generateFixtures().generateUser().done();

        const response = await request({
            url: '/user_password_resets',
            method: 'post',
            body: {
                email: 'aaa' + user.email
            }
        });

        assert.equal(response.status, 422);
    });

    it('check email content', async () => {
        const stub = sinon.stub();
        stub.returns(Promise.resolve());

        const sendEmail = proxyquire('../../src/application/sendResetPasswordEmail', {
            '../emailScheduler/sendResonatorEmail': {
                default: stub
            },
            '../../application/getUow': {
                default: () => ({
                    trackEntity: () => {}
                }),
                '@global': true
            }
        }).default;

        const [user] = await generateFixtures().generateUser().done();

        await sendEmail(user.email);

        const callArg = stub.getCall(0).args[0];

        assert.equal(callArg.to, user.email);
        assert.include(callArg.html, '.com/resetPassword?token=');
    });

    it('get reset password page', async () => {
        const [user] = await generateFixtures().generateUser().done();

        const response = await request({
            url: '/user_password_resets',
            method: 'post',
            body: {
                email: user.email
            }
        });

        const row = await user_password_resets.findOne({ where: { user_id: user.id }});
        const token = row.get('id');

        const response2 = await request({
            url: '/resetPassword?token=' + token,
            method: 'get'
        });

        assert.equal(response2.status, 200);
        assert.include(response2.text, '<html>');
    });

    it('get reset password page with an inexistent token', async () => {
        const response = await request({
            url: `/resetPassword?token=${uuid()}`,
            method: 'get'
        });

        assert.equal(response.status, 400);
        assert.deepEqual(response.body, {
            error: 'invalid token'
        });
    });

    it('change password - success', async () => {
        const [user] = await generateFixtures().generateUser().done();

        const response = await request({
            url: '/user_password_resets',
            method: 'post',
            body: {
                email: user.email
            }
        });

        const row = await user_password_resets.findOne({ where: { user_id: user.id }});
        const token = row.get('id');

        const response2 = await request({
            url: '/changePassword',
            method: 'post',
            body: {
                token,
                password: '12345678'
            }
        });

        assert.equal(response.status, 200);

        const loginResponse = await request({
            url: '/user_sessions',
            method: 'post',
            body: {
                email: user.email,
                password: '12345678'
            }
        });

        assert.equal(loginResponse.status, 200);
        assert.equal(loginResponse.body.email, user.email, 'login with the new password failed');
    });
});
