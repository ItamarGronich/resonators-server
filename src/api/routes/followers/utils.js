/**
 * Computes the URL of a queried resonator's picture.
 *
 * @param {resonators} resonator - the resonator for which to retrieve the attached picture
 * @returns {String} - the URL of the resonator's picture
 */
export const getPictureUrl = (resonator) => {
    const picture = resonator.resonator_attachments[0];
    return picture ? picture.link || `https://reminders-uploads.s3.amazonaws.com/${picture.media_id}.jpg` : null;
};

/**
 * Rounds a date to a specified resolution.
 *
 * @param {Date} date - the date to be rounded
 * @param {Number} resolution - the desired resolution in milliseconds
 * @returns {Date} - the rounded date
 */
export const roundDate = (date, resolution) => new Date(Math.round(date.getTime() / resolution) * resolution);

/**
 * Check if a given string is a valid UUID.
 *
 * @param {String} string - the string to validate
 * @returns {Boolean}
 */
export const isUuid = (string) =>
    typeof string === "string" &&
    Boolean(string.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/));

/**
 * Extracts a client's login ID from their request.
 */
export const getLoginId = (request) => request.cookies.loginId || request.headers.authorization;

/**
 * Get a resonator's question by ID.
 *
 * @param {resonators} resonator - the resonator to scan the questions of
 * @param {Number} resonatorQuestionId - the ID of the desired resonator question
 * @returns {resonator_questions} - the question found
 */
export const getResonatorQuestion = (resonator, resonatorQuestionId) =>
    resonator.resonator_questions.find((question) => question.id === resonatorQuestionId);

/**
 * Get a question's answer option by ID.
 *
 * @param {questions} question - the question to scan the answers of
 * @param {String} answerId - the ID of the desired answer
 * @returns {answers} - the answer found
 */
export const getQuestionAnswer = (question, answerId) => question.answers.find((answer) => answer.id === answerId);
