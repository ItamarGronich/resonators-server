import express from '../express';
import routeHandler from '../routeHandler';
import {getLoginUrl, loginGoogleUser} from '../../application/google/googleLogin';
import setLoginCookie from './setLoginCookie';
import renderClient from '../renderClient';

express.get('/api/startGoogleLogin', routeHandler(async (request, response) => {
    const url = await getRegistrationUrl();

    response.status(200);

    response.json({
        url
    });
}, {
    enforceLogin: false
}));

express.get('/api/completeGoogleLogin', routeHandler(async (request, response) => {
    const {code} = request.query;

    const result = await registerGoogleUser(code);

    setLoginCookie({response, loginId: result.loginId});

    response.redirect(301, '/');
}, {
    enforceLogin: false
}));
