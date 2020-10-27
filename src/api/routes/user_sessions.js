import express from '../express';
import login from '../../application/login';
import relogin from '../../application/relogin';
import logout from '../../application/logout';
import routeHandler from '../routeHandler';
import * as dtoFactory from '../../application/dto';
import setSuccessfulLoginResponse from './setSuccessfulLoginResponse';

express.post('/api/user_sessions\.:ext?', routeHandler(async (request, response) => {
    const {email, password, isLeader} = request.body;

    const {user, isValid, loginId} = await login(email, password, isLeader);

    response.status(200);

    if (isValid) {
        await setSuccessfulLoginResponse({
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

express.get('/api/user_sessions', routeHandler(async (request, response) => {
    response.status(200);
    const loginId = request.cookies.loginId || request.headers.authorization;
    const {user} = loginId ? await relogin(loginId) : false; // prevent lockout on cookies reset
    if (user) {
        const userDto = dtoFactory.toUser(user);

        await setSuccessfulLoginResponse({
            response,
            loginId,
            user: userDto
        });
    } else {
        response.json({});
    }
}, {
    enforceLogin: false
}));

express.delete('/api/user_sessions', routeHandler(async (request, response) => {
    const loginId = request.cookies.loginId || request.headers.authorization;

    const result = await logout(loginId);

    if (result) {
        response.status(200);
    } else {
        response.status(400);
    }

    response.json({});
}));
