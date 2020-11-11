import { v4 as uuid } from "uuid";

import {
    users,
    answers,
    followers,
    questions,
    resonators,
    user_logins,
    sent_resonators,
    resonator_answers,
    resonator_questions,
    resonator_attachments,
} from "../../../db/sequelize/models";

const PAGE_SIZE = 15;

/**
 * Fetches a follower's sent resonators.
 * Also returns their total number (outside of page limits).
 *
 * @param {followers} follower - the follower whose resonators are to be queried
 * @param {Number} pageNum - the page number to query. Pages are `PAGE_SIZE` big.
 */
export const fetchFollowerSentResonators = async (follower, pageNum) => ({
    resonators: await sent_resonators.findAll({
        limit: PAGE_SIZE,
        offset: pageNum * PAGE_SIZE,
        order: [["createdAt", "DESC"]],
        include: [
            resonator_answers,
            {
                model: resonators,
                required: true,
                include: [
                    {
                        model: followers,
                        where: { user_id: follower.user_id },
                        required: true
                    },
                    resonator_questions,
                    {
                        model: resonator_attachments,
                        where: { media_kind: "picture", visible: 1 },
                        order: [["createdAt", "DESC"]],
                        required: false
                    },
                ],
            },
        ],
    }),
    // Include total number of sent resonators. Required for paging by clients.
    // Avoiding use of `sent_resonators.findAndCount` since it counts rows before 
    // associations are arranged hierarchically, thus containing duplicates because of the JOINs.
    totalCount: await sent_resonators.count({
        include: [
            {
                model: resonators,
                required: true,
                include: [
                    {
                        model: followers,
                        where: { user_id: follower.user_id },
                        required: true
                    }
                ]
            },
        ],
    }),
});

/**
 * Fetches a follower's sent resonator.
 *
 * @param {followers} follower - the follower whose resonators are to be queried
 * @param {String} sentResonatorId - the ID of the sent resonator to fetch
 */
export const fetchSentResonator = async (follower, sentResonatorId) =>
    await sent_resonators.findByPk(sentResonatorId, {
        include: [
            resonator_answers,
            {
                model: resonators,
                required: true,
                include: [
                    {
                        model: followers,
                        where: { user_id: follower.user_id },
                        required: true
                    },
                    {
                        model: resonator_questions,
                        include: [
                            {
                                model: questions,
                                include: [answers],
                            },
                        ],
                    },
                    {
                        model: resonator_attachments,
                        where: { media_kind: "picture", visible: 1 },
                        order: [["createdAt", "DESC"]],
                        required: false
                    },
                ],
            },
        ],
    });

/**
 * Fetches a follower's leader from the DB.
 */
export const fetchLeader = async (follower) =>
    await leaders.findByPk(follower.leader_id, {
        include: [users],
    });

/**
 * Fetches from the DB the follower user data for a given login ID.
 *
 * @param {String} loginId - the ID of a user login
 */
export const fetchClientData = async (loginId) =>
    await user_logins.findByPk(loginId, {
        include: [
            {
                model: users,
                include: [followers],
            },
        ],
    });

/**
 * Creates a new resonator answer, or updates one if it exists.
 *
 * @param {String} answerId - the ID of the answer chosen for the given question
 * @param {String} sentResonatorId - the ID of the sent resonator for which the answer is made
 * @param {String} resonatorQuestionId - the ID of the resonator question for which the answer is made
 */
export const answerQuestion = async (answerId, sentResonatorId, resonatorQuestionId) => {
    const answer = await resonator_answers.findOne({
        where: {
            sent_resonator_id: sentResonatorId,
            resonator_question_id: resonatorQuestionId,
        },
    });

    return answer
        ? await answer.update({ answer_id: answerId })
        : await resonator_answers.create({
              id: uuid(),
              answer_id: answerId,
              sent_resonator_id: sentResonatorId,
              resonator_question_id: resonatorQuestionId,
          });
};
