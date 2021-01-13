import { getPictureUrl, roundDate } from "./utils";

const DATE_RESOLUTION = 5 * 60 * 1000; // 5 minutes

/**
 * Normalizes a queried sent resonator into preview format.
 *
 * @param {sent_resonators} resonator - a queried sent resonator
 * @returns {Object} - the formatted preview
 */
export const formatSentResonatorPreview = (resonator) => ({
    id: resonator.id,
    title: resonator.resonator.title,
    picture: getPictureUrl(resonator.resonator),
    time: roundDate(resonator.createdAt, DATE_RESOLUTION),
    done: resonator.read && resonator.resonator_answers.length === resonator.resonator.resonator_questions.length,
});

/**
 * Normalizes a queried sent resonator with full details.
 *
 * @param {sent_resonators} resonator - a queried sent resonator
 * @returns {Object} - the formatted details
 */
export const formatSentResonatorFull = (resonator) => ({
    ...formatSentResonatorPreview(resonator),
    link: resonator.resonator.link,
    content: resonator.resonator.content,
    questions: aggregateResonatorQuestions(resonator),
});

/**
 * Formats queried leader data before sending it to the client (the follower)
 *
 * @param {leaders} leader - the leader to format
 * @returns {Object} - the formatted leader
 */
export const formatLeader = (leader) => ({
    name: leader.title,
    email: leader.user.email,
});

/**
 * Normalizes and gathers sent resonator question data in a convenient format, where questions are
 * matched with their various answer options, and with the actual selected answers, if any.
 *
 * @param {sent_resonators} sentResonator - the sent resonator for which to aggregate the questions
 * @returns {Array<Object>} - the formatted data
 */
const aggregateResonatorQuestions = (sentResonator) => {
    return sentResonator.resonator.resonator_questions
        .sort((a, b) => a.order - b.order)
        .map((question) => ({
            id: question.id,
            body: question.question.description,
            type: question.question.question_kind,
            options: question.question.answers.map((answer) => ({
                id: answer.id,
                label: answer.body,
                value: answer.rank,
            })),
            answer: getChosenAnswer(sentResonator, question),
        }));
};

/**
 * Finds the ID of the answer chosen for a given sent resonators question.
 *
 * @param {sent_resonators} sentResonator - the sent resonator in question
 * @param {resonator_questions} resonatorQuestion - the question for which to get the answer
 * @returns {String} - the ID of the answer option chosen for the given resonator question in the given sent resonator
 */
const getChosenAnswer = (sentResonator, resonatorQuestion) => {
    const resonatorAnswer = sentResonator.resonator_answers.find(
        (answer) => answer.resonator_question_id === resonatorQuestion.id
    );
    return resonatorAnswer ? resonatorAnswer.answer_id : null;
};
