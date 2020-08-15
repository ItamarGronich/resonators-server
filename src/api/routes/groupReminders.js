import express from '../express';
import routeHandler from '../routeHandler';
import multer from 'multer';
import * as service from '../../application/groupResonators';

const upload = multer();

express.get('/api/leader_followerGroups/:followerGroupId/reminders\.:ext?', routeHandler(async (request, response) => {
    const resonators = await service.getGroupResonators(request.params.followerGroupId);
    response.status(200).json(resonators);
}, {
        enforceLeaderFollowerGroup: true
    }));

express.get('/api/leader_followerGroups/:followerGroupId/reminders/:reminderId\.:ext?', routeHandler(async (request, response) => {
    const resonator = await service.getGroupResonator(request.params.reminderId);
    response.status(200).json(resonator);
}, {
        enforceLeaderFollowerGroup: true
    }));

express.post('/api/leader_followerGroups/:followerGroupId/reminders\.:ext?', routeHandler(async (request, response) => {
    const { leader } = request.appSession;
    const result = await service.createGroupResonator(leader.id, request.body);
    response.status(201).json(result);
}, {
        enforceLeaderFollowerGroup: true
    }));

express.put('/api/leader_followerGroups/:followerGroupId/reminders/:reminderId\.:ext?', routeHandler(async (request, response) => {
    const result = await service.updateGroupResonator(request.params.reminderId, request.body);
    response.status(202).json(result);
}, {
        enforceLeaderFollowerGroup: true
    }));

express.post('/api/leader_followerGroups/:followerGroupId/reminders/:reminderId/criteria\.:ext?', routeHandler(async (request, response) => {
    const { reminder_id, question_id } = request.body;
    const result = await service.addBulkQuestionsToGroupResonator(reminder_id, question_id);
    response.status(result ? 202 : 422).json(result);
}, {
        enforceLeaderFollowerGroup: true
    }));

express.delete('/api/leader_followerGroups/:followerGroupId/reminders/:reminderId/criteria/:criterionId\.:ext?', routeHandler(async (request, response) => {
    const { reminderId, criterionId } = request.params;
    const result = await service.removeQuestionFromGroupResonator(reminderId, criterionId);
    response.status(result ? 202 : 422).json(result);
}, {
        enforceLeaderFollowerGroup: true
    }));

(() => {
    var itemsUpload = upload.fields([{
        name: 'follower_group_id'
    }, {
        name: 'reminder_id'
    }, {
        name: 'media_kind'
    }, {
        name: 'media_title'
    }, {
        name: 'media_data'
    }]);

    express.post('/api/leader_followerGroups/:followerGroupId/reminders/:reminderId/items\.:ext?', itemsUpload, routeHandler(async (request, response) => {
        const {
            follower_group_id,
            reminder_id,
            media_kind,
            media_title
        } = request.body;

        const mediaData = request.files.media_data;

        await service.addItemToGroupResonator(reminder_id, {
            follower_group_id,
            reminder_id,
            media_kind,
            title: media_title
        }, mediaData[0].buffer);

        response.status(201).json();
    }, {
            enforceLeaderFollowerGroup: true
        }));
})();

express.delete('/api/leader_followerGroups/:followerGroupId/reminders/:reminderId/items/:itemId\.:ext?', routeHandler(async (request, response) => {
    const { reminderId, itemId } = request.params;
    const result = await service.removeGroupResonatorItem(reminderId, itemId);
    response.status(result ? 202 : 422).json();
}, {
        enforceLeaderFollowerGroup: true
    }));

express.delete('/api/leader_followerGroups/:followerGroupId/reminders/:reminderId\.:ext?', routeHandler(async (request, response) => {
    const { reminderId } = request.params;
    const result = await service.removeGroupResonator(reminderId);
    response.status(result ? 202 : 422).json();
}, {
        enforceLeaderFollowerGroup: true
    }));

express.delete('/api/leader_followerGroups/:followerGroupId/reminders/:reminderId/removeImage/:itemId\.:ext?', routeHandler(async (request, response) => {
    const { reminderId, itemId } = request.params;
    const result = await service.removeGroupResonatorImage(reminderId, itemId);
    response.status(result ? 202 : 422).json();
}, {
        enforceLeaderFollowerGroup: true
    }));
