import express from '../express';
import routeHandler from '../routeHandler';
import {getResonatorStats, sendResonatorAnswer} from '../../application/resonatorStats';

express.get('/criteria/stats/reminders/:resonatorId/criteria', routeHandler(async (request, response) => {
    const {resonatorId} = request.params;

    const stats = await getResonatorStats(resonatorId);

    if (!stats)
        response.status(422);
    else
        response.status(200);

    response.json(stats);
}, {
    enforceLeaderResonator: true
}));

express.get(`/criteria/stats/reminders/:resonator_id/criteria/submit`, routeHandler(async (request, response) => {
    const {resonator_id} = request.params;
    const {question_id, answer_id, sent_resonator_id} = request.query;

    if (!question_id || !answer_id || !sent_resonator_id) {
        response.status(400);
        return response.json({});
    }

    const result = await sendResonatorAnswer({
        resonator_id,
        question_id,
        answer_id,
        sent_resonator_id
    });

    if (!result)
        response.status(422);
    else
        response.status(200);

    response.json(result);
}, {
    enforceLogin: false
}));
