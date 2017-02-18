import express from '../express';
import routeHandler from '../routeHandler';
import {
    getLeaderClinics,
    getLeaderClinicsCriteria,
    addQuestionToClinic
} from '../../application/leaderClinics';

express.get('/leader_clinics', routeHandler(async (request, response) => {
    const {user} = request.appSession;

    const clinics = await getLeaderClinics(user.id);

    response.status(200);
    response.json(clinics);
}));

express.get('/leader_clinics/:clinicId/criteria', routeHandler(async (request, response) => {
    const {leader} = request.appSession;

    const {clinicId} = request.params;

    const clinic_id = clinicId === 'all' ? undefined : clinicId;

    const questions = await getLeaderClinicsCriteria(leader.id, clinic_id);

    if (!questions)
        response.status(422);
    else
        response.status(200);

    response.json(questions);
}));

express.post('/leader_clinics/:clinicId/criteria', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    const question = request.body;
    const newQuestion = await addQuestionToClinic(request.params.clinicId, leader.id, question);

    response.status(201);
    response.json(newQuestion);
}));
