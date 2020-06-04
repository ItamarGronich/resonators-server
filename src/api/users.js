import express from './express';
import Users from '../db/sequelize/models/user';

express.get('/users', async (request, response) => {
    response.status(200);

    const rows = await Users.findAll();
    const users = rows.map(r => r.dataValues);

    response.json({ users });
});
