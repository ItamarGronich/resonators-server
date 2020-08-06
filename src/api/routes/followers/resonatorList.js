import { Model } from "sequelize";

import app from "../../express";
import routeHandler from "../../routeHandler";
import Follower from "../../../domain/entities/follower";
import {
    resonators,
    resonator_attachments,
    resonator_questions,
    sent_resonators,
    resonator_answers,
} from "../../../db/sequelize/models";

app.get(
    "/api/follower/resonators",
    routeHandler(
        async (request, response) => {
            response.status(200).json({
                resonators: (await getFollowerResonators(request.appSession.follower)).map(formatResonatorPreview),
            });
        },
        { enforceFollower: true }
    )
);

/**
 * Queries the DB for minimal data relevant for previewing the resonators belonging to a certain follower.
 *
 * @param {Follower} follower - the follower for whom to find their resonators
 * @returns {Promise<Array<Model>>} - the resonators belonging to the given follower user
 */
const getFollowerResonators = async (follower) =>
    await resonators.findAll({
        where: {
            follower_id: follower.id,
            pop_email: true, // filter out inactive resonators for followers
        },
        include: [
            resonator_questions, // required for counting total questions in resonators
            {
                // fetching the most up-to-date thumbnail
                model: resonator_attachments,
                where: { media_kind: "picture" },
                order: [["created_at", "DESC"]],
                limit: 1,
            },
            {
                // required for counting answered questions for last resonator instances
                model: sent_resonators,
                include: [resonator_answers],
                order: [["created_at", "DESC"]],
                limit: 1,
            },
        ],
    });

/**
 * Converts a resonator's data to a format suitable for a minimal follower preview.
 *
 * Note: this should have been possible to achieve in the above query itself,
 *       but proved to be too complicated to be worth it.
 *
 * @param {Model} resonator - a resonator as queried from the DB
 * @returns {Object}
 */
const formatResonatorPreview = (resonator) => ({
    id: resonator.id,
    title: resonator.title,
    content: resonator.content,
    popTime: resonator.pop_time,
    popDays: resonator.repeat_days,
    lastPopTime: resonator.last_pop_time,
    isOneTime: resonator.one_off,
    thumbnail: getThumbnailUrl(resonator),
    questions: {
        total: resonator.resonator_questions.length,
        answered: getAnsweredQuestions(resonator),
    },
});

/**
 * Compute the URL of the thumbnail for a queried resonator.
 *
 * @param {Model} resonator - the resonator to get the image for
 * @returns {String|null}
 */
const getThumbnailUrl = (resonator) => {
    const thumbnail = resonator.resonator_attachments[0];
    return thumbnail && thumbnail.visible
        ? thumbnail.link || `https://reminders-uploads.s3.amazonaws.com/${thumbnail.media_id}.jpg`
        : null;
};

/**
 * Compute the number of questions that were answered for the last instance of a given resonator,
 * or null if it has never been sent yet.
 *
 * @param {Model} resonator
 * @returns {Number|null}
 */
const getAnsweredQuestions = (resonator) =>
    resonator.last_pop_time ? resonator.sent_resonators[0].resonator_answers.length : null;
