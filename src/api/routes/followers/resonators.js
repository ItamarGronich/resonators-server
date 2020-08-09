import api from "./mount";
import { validateUuid, validatePageNum } from "./validations";
import { getResonatorQuestion, getQuestionAnswer } from "./utils";
import { formatSentResonatorPreview, formatSentResonatorFull } from "./normalizers";
import { fetchFollowerSentResonators, fetchSentResonator, answerQuestion } from "./queries";

/**
 * Returns a listing of a follower's resonator instances.
 */
api.get("/resonators", validatePageNum, async (req, res) => {
    const { resonators, totalCount } = await fetchFollowerSentResonators(req.follower, req.query.page || 0);

    res.status(200).json({
        resonators: resonators.map(formatSentResonatorPreview),
        totalCount,
    });
});

/**
 * Returns full data for a follower's sent resonator.
 */
api.get(
    "/resonators/:sentResonatorId",
    validateUuid((req) => req.params.sentResonatorId),
    async (req, res) => {
        const sentResonator = await fetchSentResonator(req.follower, req.params.sentResonatorId);

        if (!sentResonator) {
            res.status(404).error("Follower has no such resonator");
        } else {
            res.status(200).json({
                resonator: formatSentResonatorFull(sentResonator),
            });
        }
    }
);

/**
 * Receives a follower's reply to a sent resonator.
 */
api.put(
    "/resonators/:sentResonatorId",
    validateUuid((req) => req.body.answerId),
    validateUuid((req) => req.params.sentResonatorId),
    validateUuid((req) => req.body.resonatorQuestionId),
    async (req, res) => {
        const { sentResonatorId } = req.params;
        const { resonatorQuestionId, answerId } = req.body;

        const sentResonator = await fetchSentResonator(req.follower, req.params.sentResonatorId);

        if (!sentResonator) {
            res.status(404).error("Follower has no such resonator");
        } else {
            const resonatorQuestion = getResonatorQuestion(sentResonator.resonator, resonatorQuestionId);
            if (!resonatorQuestion) {
                res.status(422).error("Resonator has no such question");
            } else if (!getQuestionAnswer(resonatorQuestion.question, answerId)) {
                res.status(422).error("Question has no such answer option");
            } else {
                await answerQuestion(answerId, sentResonatorId, resonatorQuestionId);

                res.status(200).json({
                    resonator: formatSentResonatorFull(
                        await fetchSentResonator(req.follower, req.params.sentResonatorId)
                    ),
                });
            }
        }
    }
);
