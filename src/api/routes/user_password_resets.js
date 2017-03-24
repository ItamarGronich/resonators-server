import express from '../express';
import routeHandler from '../routeHandler';
import sendResetPasswordEmail from '../../application/sendResetPasswordEmail';
import resetPasswordTokenValidator from '../../application/resetPasswordTokenValidator';
import {getLatestAssetLink} from '../../application/versionableAssets';
import changePassword from '../../application/changePassword';
import renderClient from '../renderClient';

express.post('/api/user_password_resets\.:ext?', routeHandler(async (request, response) => {
    const {email} = request.body;
    const result = await sendResetPasswordEmail(email);

    if (result.error)
        response.status(422);
    else
        response.status(200);

    response.json(result);
}, {
    enforceLogin: false
}));

express.post('/api/changePassword', routeHandler(async (request, response) => {
    const {token, password} = request.body;

    const result = await changePassword(token, password);

    if (result.error) {
        response.status(422);
    } else {
        response.status(200);
    }

    response.json(result);
}, {
    enforceLogin: false
}));

express.get('/api/resetPassword', routeHandler(async (request, response) => {
    const tokenValid = await resetPasswordTokenValidator(request.query.token);

    if (tokenValid) {
        response.status(200);
        await renderClient(request, response);
    } else {
        response.status(400);
        response.json({
            error: 'invalid token'
        });
    }
}, {
    enforceLogin: false
}));
