import _ from 'lodash';
import express from '../express';
import login from '../../application/login';
import relogin from '../../application/relogin';
import routeHandler from '../routeHandler';
import * as dtoFactory from '../../application/dto';
import setSuccessfulLoginResponse from './setSuccessfulLoginResponse';
import moment from 'moment';

express.post('/user_sessions\.:ext?', routeHandler(async (request, response) => {
    const {email, password} = request.body;

    const {user, isValid, loginId} = await login(email, password);

    response.status(200);

    if (isValid) {
        setSuccessfulLoginResponse({
            response,
            loginId,
            user
        });
    } else {
        response.json({});
    }
}, {
    enforceLogin: false
}));

express.get('/user_sessions', routeHandler(async (request, response) => {
    response.status(200);
    const loginId = request.cookies.loginId || request.headers.authorization;
    const {user} = await relogin(loginId);
    const resp = user ? dtoFactory.toUser(user) : {};
    response.json(resp);
}, {
    enforceLogin: false
}));
