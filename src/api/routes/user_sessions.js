import _ from 'lodash';
import express from '../express';
import login from '../../application/login';
import relogin from '../../application/relogin';
import routeHandler from '../routeHandler';
import * as dtoFactory from '../../application/dto';
import moment from 'moment';

express.post('/user_sessions\.:ext?', routeHandler(async (request, response) => {
    const {email, password} = request.body;

    const {user, isValid, loginId} = await login(email, password);

    response.status(200);

    if (isValid) {
        const maxAge = 3600 * 24 * 7 * 1000;
        const expires_at = moment().add(maxAge, 's').format();

        response.cookie('loginId', loginId, {
            maxAge
        });

        response.json({...user, expires_at});
    } else {
        response.json({});
    }
}, {
    enforceLogin: false
}));

express.get('/user_sessions', routeHandler(async (request, response) => {
    response.status(200);
    const {loginId} = request.cookies;
    const {user} = await relogin(loginId);
    const resp = user ? dtoFactory.toUser(user) : {};
    response.json(resp);
}, {
    enforceLogin: false
}));
