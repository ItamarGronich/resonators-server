import express from '../express';
import routeHandler from '../routeHandler';
import {getLeaderClinics} from '../../application/leaderClinics';

express.get('/leader_clinics', routeHandler(async (request, response) => {
    const {user} = request.appSession;

    const clinics = await getLeaderClinics(user.id);

    response.status(200);
    response.json(clinics);
}));
