import express from '../express';
import routeHandler from '../routeHandler';

express.post('/renderResonator\.:ext?', routeHandler(async (request, response) => {
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
}, {
    enforceLogin: false
}));

express.get('/user_sessions\.:ext?', routeHandler(async (request, response) => {
    response.status(200);

    response.json({
        loginResult: {
            user: dtoFactory.toUser(request.appSession.user),
            isValid: true
        }
    });
}));

