import express from '../express';

import routeHandler from '../routeHandler';
import { getResonators } from '../../application/resonators'
import {
    leaders,
    resonators,
    questions,
    resonator_attachments,
    resonator_questions,
    sent_resonators,
    resonator_answers
} from '../../db/sequelize/models'


express.get('/api/follower/resonators', routeHandler(async (request, response) => {
    const follower = request.appSession.follower;

    if (follower)
        response
            .status(200)
            .json({
                resonators: await getFollowerResonators(follower)
            })
    else
        response
            .status(405)
            .json({
                status: "You must be a follower to have resonators"
            })
}));


const getFollowerResonators = async follower =>
    await resonators.findAll({
        where: {
            follower_id: follower.id,
            pop_email: true
        },
        include: [
            leaders,
            resonator_attachments,
            {
                model: resonator_questions,
                include: [questions]
            },
            {
                model: sent_resonators,
                order: [['created_at', 'DESC']],
                limit: 1,
                include: [resonator_answers]
            }
        ]
    })
