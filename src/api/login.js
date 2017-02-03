import express from './express';
import login from '../application/login';
import routeHandler from './routeHandler';

express.post('/user_sessions', routeHandler(async (request, response) => {
    const {email, password} = request.body;
    const loginResult = await login(email, password);

    response.status(200);
    response.cookie('auth_token', )
    response.json({ loginResult });
}));
