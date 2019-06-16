import express from '../express';
import routeHandler from '../routeHandler';
import {
    getLeaderClinics,
    getLeaderClinicsIncludingSecondary,
    getLeaderClinicsCriteria,
    addQuestionToClinic,
    updateQuestion,
    UpsertLeaderClinics,
    UpdateCurrentClinicId,
    addLeaderToClinic
} from '../../application/leaderClinics';

express.get('/api/leader_clinics', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    const clinics = await getLeaderClinicsIncludingSecondary(leader.id);
    response.status(200);
    response.json(clinics);
}));

express.get('/api/upsert_leader_clinics', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    await UpsertLeaderClinics();
    response.status(200);
    response.json(leader);
}));

express.get('/api/updateCurrentClinicId', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    await UpdateCurrentClinicId();
    response.status(200);
    response.json(leader);
}));

express.get('/api/leader_clinics/:clinicId/criteria\.:ext?', routeHandler(async (request, response) => {
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

express.post('/api/leader_clinics\.:ext?', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    var leaderClinic = request.body.email;
    await addLeaderToClinic(leaderClinic);
    response.status(201);
}));

express.post('/api/leader_clinics/:clinicId/criteria\.:ext?', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    const question = request.body;
    const newQuestion = await addQuestionToClinic(request.params.clinicId, leader.id, question);

    response.status(201);
    response.json(newQuestion);
}));

express.put('/api/leader_clinics/:clinicId/criteria/:criterionId\.:ext?', routeHandler(async (request, response) => {
    let question = request.body;
    const updatedQuestion = await updateQuestion(question);

    if (!updatedQuestion)
        response.status(422);
    else
        response.status(200);

    response.json(updatedQuestion);
}));
