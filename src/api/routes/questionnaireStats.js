import express from '../express';
import routeHandler from '../routeHandler';
import { sendQuestionnaireAnswer, getQuestionnaireData } from '../../application/resonatorQuestionnaireStats';
import renderClient from '../renderClient';

express.post(`/api/questionnaire/stats/reminders/:resonator_id/questionnaire/submit`, routeHandler(async (request, response) => {
    const { resonator_id } = request.params;
    const { question_id, answer } = request.body;

    const result = await sendAnswer({ resonator_id, question_id, answer });

    if (result)
        response.json({});
    else {
        response.status(422);
        response.send('Answer submission failed.');
    }
}, {
        enforceLogin: false
    }));

express.get(`/api/questionnaire/stats/reminders/:resonator_id/questionnaire/submit`, routeHandler(async (request, response) => {
    const { resonator_id } = request.params;
    const { question_id, answer } = request.query;
    const result = await sendAnswer({ resonator_id, question_id, answer });

    if (result)
        await renderClient(request, response, result);
    else {
        response.status(422);
        response.send('Answer submission failed.');
        return false;
    }
}, {
        enforceLogin: false
    }));

async function sendAnswer({ resonator_id, question_id, answer, response }) {
    if (answer) {
        if (!question_id) {
            response.status(400);
            return response.json({});
        }
        return await sendQuestionnaireAnswer({
            resonator_id,
            question_id,
            answer
        });
    }
    else {
        return await getQuestionnaireData({
            resonator_id
        });
    }
}
