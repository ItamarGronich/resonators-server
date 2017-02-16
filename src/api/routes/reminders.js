import express from '../express';
import routeHandler from '../routeHandler';
import enforceLeaderFollowers from '../permissions/enforceLeaderFollowers';
import {getResonators, getResonator, createResonator, updateResonator, addQuestionToResonator} from '../../application/resonators';

express.get('/leader_followers/:followerId/reminders', routeHandler(async (request, response) => {
    const resonators = await getResonators(request.params.followerId);
    response.status(200);
    response.json(resonators);
}, {
    enforceLeaderFollower: true
}));

express.get('/leader_followers/:followerId/reminders/:reminderId', routeHandler(async (request, response) => {
    const resonator = await getResonator(request.params.reminderId);
    response.status(200);
    response.json(resonator);
}, {
    enforceLeaderFollower: true
}));

express.post('/leader_followers/:followerId/reminders', routeHandler(async (request, response) => {
    const {leader} = request.appSession;
    const result = await createResonator(leader.id, request.body);
    response.status(201);
    response.json(result);
}, {
    enforceLeaderFollower: true
}));

express.put('/leader_followers/:followerId/reminders/:reminderId', routeHandler(async (request, response) => {
    const result = await updateResonator(request.params.reminderId, request.body);
    response.status(200);
    response.json(result);
}, {
    enforceLeaderFollower: true
}));

express.post('/leader_followers/:followerId/reminders/:reminderId/criteria', routeHandler(async (request, response) => {
    const {reminder_id, question_id} = request.body;
    const result = await addQuestionToResonator(reminder_id, question_id);

    if (!result) {
        response.status(422);
    } else 
        response.status(200);

    response.json(result);
}, {
    enforceLeaderFollower: true
}));
