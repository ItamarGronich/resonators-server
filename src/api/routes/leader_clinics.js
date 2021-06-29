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
    addLeaderToClinic,
    freezeCriterion,
    unfreezeCriterion,
    saveClinicSettings,
    uploadClinicMedia
} from '../../application/leaderClinics';
import multer from 'multer';

const upload = multer();

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

express.post('/api/leader_clinics/:criterionId/freeze\.:ext?', routeHandler(async (request, response) => {
    const {criterionId} = request.params;
    
    const result = await freezeCriterion(criterionId);

    response.status(result ? 200 : 422);
    response.json(result);
}, {   
}));

express.post('/api/leader_clinics/:criterionId/unfreeze\.:ext?', routeHandler(async (request, response) => {
    const {criterionId} = request.params;

    const result = await unfreezeCriterion(criterionId);

    response.status(result ? 200 : 422);
    response.json(result);
}, {    
}));

express.post('/api/leader_clinics/clinic_settings', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    const result = await saveClinicSettings(leader.id, request.body);

    response.status(result ? 200 : 422);
    response.json(result);
}));

(() => {
    var itemsUpload = upload.fields([{
        name: 'field_name'
    }, {
        name: 'media_kind'
    }, {
        name: 'media_title'
    }, {
        name: 'media_data'
    }]);

    express.post('/api/leader_clinics/clinic_settings/upload', itemsUpload, routeHandler(async (request, response) => {
        const {leader} = request.appSession;
        const mediaData = request.files.media_data;
        const result = await uploadClinicMedia(leader.id, request.body.field_name, mediaData[0].buffer);

        response.status(result ? 200 : 422);
        response.json(result);
    }));
})();
