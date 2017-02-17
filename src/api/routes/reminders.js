import express from '../express';
import routeHandler from '../routeHandler';
import enforceLeaderFollowers from '../permissions/enforceLeaderFollowers';
import * as service from '../../application/resonators';

express.get('/leader_followers/:followerId/reminders', routeHandler(async (request, response) => {
    const resonators = await service.getResonators(request.params.followerId);

    response.status(200);
    response.json(resonators);
}, {
    enforceLeaderFollower: true
}));

express.get('/leader_followers/:followerId/reminders/:reminderId', routeHandler(async (request, response) => {
    const resonator = await service.getResonator(request.params.reminderId);

    response.status(200);
    response.json(resonator);
}, {
    enforceLeaderFollower: true
}));

express.post('/leader_followers/:followerId/reminders', routeHandler(async (request, response) => {
    const {leader} = request.appSession;

    const result = await service.createResonator(leader.id, request.body);

    response.status(201);
    response.json(result);
}, {
    enforceLeaderFollower: true
}));

express.put('/leader_followers/:followerId/reminders/:reminderId', routeHandler(async (request, response) => {
    const result = await service.updateResonator(request.params.reminderId, request.body);

    response.status(200);
    response.json(result);
}, {
    enforceLeaderFollower: true
}));

express.post('/leader_followers/:followerId/reminders/:reminderId/criteria', routeHandler(async (request, response) => {
    const {reminder_id, question_id} = request.body;

    const result = await service.addQuestionToResonator(reminder_id, question_id);

    if (!result) {
        response.status(422);
    } else
        response.status(200);

    response.json(result);
}, {
    enforceLeaderFollower: true
}));

express.delete('/leader_followers/:followerId/reminders/:reminderId/criteria/:criterionId', routeHandler(async (request, response) => {
    const {reminderId, criterionId} = request.params;

    const result = await service.removeQuestionFromResonator(reminderId, criterionId);

    if (!result) {
        response.status(422);
    } else
        response.status(200);

    response.status(200);

    response.json(result);
}, {
    enforceLeaderFollower: true
}));
