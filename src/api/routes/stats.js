import express from '../express';
import routeHandler from '../routeHandler';
import {getResonatorStats, sendResonatorAnswer} from '../../application/resonatorStats';

express.get('/api/criteria/stats/reminders/:resonatorId\.:ext?', routeHandler(async (request, response) => {
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

express.post(`/api/criteria/stats/reminders/:resonator_id/criteria/submit`, routeHandler(async (request, response) => {
    const {resonator_id} = request.params;
    const {question_id, answer_id, sent_resonator_id} = request.body;

    const result = await sendAnswer({resonator_id, question_id, answer_id, sent_resonator_id});

    if (result)
        response.status(200).json(result);
    else 
        response.status(422).send('Answer submission failed.');
}, {
    enforceLogin: false
}));

async function sendAnswer({resonator_id, question_id, answer_id, sent_resonator_id, response}) {
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
