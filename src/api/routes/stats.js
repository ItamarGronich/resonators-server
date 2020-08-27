import express from '../express';
import routeHandler from '../routeHandler';
import {
    getResonatorStats,
    getAllGroupStats,
    sendResonatorAnswer,
    getResonatorStatsFileName,
    getGroupStatsFileName
} from '../../application/resonatorStats';
import { sendCsvDownload } from './utils';


express.get('/api/criteria/stats/reminders/:resonatorId\.:ext?', routeHandler(async (request, response) => {
    const { resonatorId } = request.params;
    const stats = await getResonatorStats(resonatorId);
    response.status(stats ? 200 : 422).send(stats);
}, {
    enforceLeaderResonator: true
}));

express.get('/api/criteria/stats/reminders/:resonatorId/download\.:ext?', routeHandler(async (request, response) => {
    const { resonatorId } = request.params;
    const stats = await getResonatorStats(resonatorId);
    if (stats) {
        response.status(200);
        await sendCsvDownload(response, stats, 'text/csv', await getResonatorStatsFileName(resonatorId))
    } else {
        response.sendStatus(422);
    }
}, {
    enforceLeaderResonator: true
}));

express.get('/api/criteria/stats/followerGroups/:followerGroupId/download\.:ext?', routeHandler(async (request, response) => {
    const { followerGroupId } = request.params;
    const stats = await getAllGroupStats(followerGroupId);
    if (stats) {
        response.status(200);
        await sendCsvDownload(response, stats, 'text/csv', await getGroupStatsFileName(followerGroupId))
    } else {
        response.sendStatus(422);
    }
}, {
    enforceLeaderFollowerGroup: true
}));

express.post(`/api/criteria/stats/reminders/:resonator_id/criteria/submit`, routeHandler(async (request, response) => {
    const { resonator_id } = request.params;
    const { question_id, answer_id, sent_resonator_id } = request.body;

    const result = await sendAnswer({ resonator_id, question_id, answer_id, sent_resonator_id });

    if (result)
        response.status(200).json(result);
    else
        response.status(422).send('Answer submission failed.');
}, {
    enforceLogin: false
}));

async function sendAnswer({ resonator_id, question_id, answer_id, sent_resonator_id, response }) {
    if (!question_id || !answer_id || !sent_resonator_id) {
        response.status(400);
        return response.json({});
    }

    return await sendResonatorAnswer({
        resonator_id,
        question_id,
        answer_id,
        sent_resonator_id
    });
}
