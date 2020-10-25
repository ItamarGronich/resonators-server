import express from '../express';
import routeHandler from '../routeHandler';
import {getLoginUrl, loginGoogleUser} from '../../application/google/googleLogin';
import setLoginCookie from './setLoginCookie';

express.post('/api/startGoogleLogin', routeHandler(async (request, response) => {
    const {isLeader} = request.body;
    const url = await getLoginUrl(isLeader);

    response.status(200);

    response.json({
        url
    });
}, {
    enforceLogin: false
}));

express.get('/api/completeGoogleLogin', routeHandler(async (request, response) => {
    const {code, state} = request.query;
    const stateObject = JSON.parse(state);
    const result = await loginGoogleUser(code, stateObject);
    let redirectUrl = (stateObject.isLeader === true) ? '/loginLeader' : '/login'; // Redirect to login by default based on Login Mode selected

    if (result && typeof result.loginId !== "undefined") {
        setLoginCookie({response, loginId: result.loginId});
        redirectUrl = (stateObject.isLeader === true) ? '/followers' : '/follower/resonators' // If logged in, redirect to the appropriate page
    } else if (result && typeof result.error !== "undefined" && result.error) {
        redirectUrl += '?error=' + result.error; // Display error if applicable
    }

    response.redirect(301, redirectUrl);
}, {
    enforceLogin: false
}));
