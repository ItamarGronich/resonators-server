import express from '../express';
import routeHandler from '../routeHandler';
import sendResetPasswordEmail from '../../application/sendResetPasswordEmail';
import resetPasswordTokenValidator from '../../application/resetPasswordTokenValidator';
import {getLatestAssetLink} from '../../application/versionableAssets';
import changePassword from '../../application/changePassword';

express.post('/user_password_resets\.:ext?', routeHandler(async (request, response) => {
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

express.post('/changePassword', routeHandler(async (request, response) => {
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

express.get('/resetPassword', routeHandler(async (request, response) => {
    const tokenValid = await resetPasswordTokenValidator(request.query.token);
    const link = await getLatestAssetLink('resonators-client');

    if (tokenValid) {
        response.status(200);
        response.render('../pages/index', {link});
    } else {
        response.status(400);
        response.json({
            error: 'invalid token'
        });
    }
}, {
    enforceLogin: false
}));
