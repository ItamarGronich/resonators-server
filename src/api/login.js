import express from './express';
import login from '../application/login';
import routeHandler from './routeHandler';

express.get('/login', routeHandler(async (request, response) => {
    const loginResult = await login(request.query.email, request.query.password);

    response.status(200);
    response.json({ loginResult });
}));
