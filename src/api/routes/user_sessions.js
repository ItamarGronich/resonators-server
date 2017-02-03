import express from '../express';
import login from '../../application/login';
import relogin from '../../application/relogin';
import routeHandler from '../routeHandler';

express.post('/user_sessions', routeHandler(async (request, response) => {
    const {email, password} = request.body;

    const {user, isValid, loginId} = await login(email, password);

    response.status(200);

    if (isValid) {
        response.cookie('loginId', loginId, {
            maxAge: 3600 * 24 * 7 * 1000
        });
    }

    response.json({
        loginResult: {
            user,
            isValid
        }
    });
}));

express.get('/user_sessions', routeHandler(async (request, response) => {
    const {loginId} = request.cookies;

    const {user, isValid} = await relogin(loginId);

    response.status(200);

    response.json({
        loginResult: {
            user,
            isValid
        }
    });
}));
