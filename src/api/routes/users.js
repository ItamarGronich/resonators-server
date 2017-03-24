import express from '../express';
import routeHandler from '../routeHandler';
import {registerUser} from '../../application/registerUser';
import * as dtoFactory from '../../application/dto';
import setSuccessfulLoginResponse from './setSuccessfulLoginResponse';

express.post('/api/users\.:ext?', routeHandler(async (request, response) => {
    const {email, name, password} = request.body;

    const registrationResult = await registerUser({
        email, name, password
    });

    if (registrationResult.isValid) {
        setSuccessfulLoginResponse({
            response,
            user: registrationResult.user,
            loginId: registrationResult.loginId
        });
    } else {
        response.status(422);
        response.json({error: registrationResult.error});
    }
}, {
    enforceLogin: false
}));
