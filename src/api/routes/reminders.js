import express from '../express';
import routeHandler from '../routeHandler';
import enforceLeaderFollowers from '../permissions/enforceLeaderFollowers';
import multer from 'multer';
import * as service from '../../application/resonators';

const upload = multer();

express.get('/leader_followers/:followerId/reminders\.:ext?', routeHandler(async (request, response) => {
    const resonators = await service.getResonators(request.params.followerId);

    response.status(200);
    response.json(resonators);
}, {
    enforceLeaderFollower: true
}));

express.get('/leader_followers/:followerId/reminders/:reminderId\.:ext?', routeHandler(async (request, response) => {
    const resonator = await service.getResonator(request.params.reminderId);

    response.status(200);
    response.json(resonator);
}, {
    enforceLeaderFollower: true
}));

express.post('/leader_followers/:followerId/reminders\.:ext?', routeHandler(async (request, response) => {
    const {leader} = request.appSession;

    const result = await service.createResonator(leader.id, request.body);

    response.status(201);
    response.json(result);
}, {
    enforceLeaderFollower: true
}));

express.put('/leader_followers/:followerId/reminders/:reminderId\.:ext?', routeHandler(async (request, response) => {
    const result = await service.updateResonator(request.params.reminderId, request.body);

    response.status(200);
    response.json(result);
}, {
    enforceLeaderFollower: true
}));

express.post('/leader_followers/:followerId/reminders/:reminderId/criteria\.:ext?', routeHandler(async (request, response) => {
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

express.delete('/leader_followers/:followerId/reminders/:reminderId/criteria/:criterionId\.:ext?', routeHandler(async (request, response) => {
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

(() => {
    var itemsUpload = upload.fields([{
        name: 'follower_id'
    }, {
        name: 'reminder_id'
    }, {
        name: 'media_kind'
    }, {
        name: 'media_title'
    }, {
        name: 'media_data'
    }]);

    express.post('/leader_followers/:followerId/reminders/:reminderId/items\.:ext?', itemsUpload, routeHandler(async (request, response) => {
        const {
            follower_id,
            reminder_id,
            media_kind,
            media_title
        } = request.body;

        const mediaData = request.files.media_data;

        await service.addItemToResonator(reminder_id, {
            follower_id,
            reminder_id,
            media_kind,
            title: media_title
        }, mediaData[0].buffer);

        response.status(201);
        response.json({});
    }, {
        enforceLeaderFollower: true
    }));
})();

express.delete('/leader_followers/:followerId/reminders/:reminderId/items/:itemId\.:ext?', routeHandler(async (request, response) => {
    const {reminderId, itemId} = request.params;

    const result = await service.removeResonatorItem(reminderId, itemId);

    if (!result)
        response.status(422);
    else
        response.status(200);

    response.json({});
}, {
    enforceLeaderFollower: true
}));

express.delete('/leader_followers/:followerId/reminders/:reminderId\.:ext?', routeHandler(async (request, response) => {
    const {reminderId} = request.params;

    const result = await service.removeResonator(reminderId);

    if (!result)
        response.status(422);
    else
        response.status(200);

    response.json({});
}, {
    enforceLeaderFollower: true
}));
