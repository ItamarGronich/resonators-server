import _ from 'lodash';
import resonatorStatsRepository from '../db/repositories/ResonatorStatsRepository';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import questionRepository from '../db/repositories/QuestionRepository';
import sentResonatorRepository from '../db/repositories/SentResonatorRepository';
import getUow from './getUow';

export async function getResonatorStats(resonatorId) {
    const stats = await resonatorStatsRepository.findById(resonatorId);
    const questionIds = _.map(stats.criteria, (v, qid) => qid);
    const questions = await questionRepository.findManyById(questionIds);

    const answersMap = _.flatMap(questions, 'answers').reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
    }, {});

    const answers = _(stats.criteria)
    .map((arr, question_id) => _.map(arr, a => ({
        question_id, rank: answersMap[a.answer_id].rank, time: a.created_at
    })))
    .reduce((acc, cur) => acc.concat(cur), []);

    const sortedAnswers = _.orderBy(answers, a => a.time, ['desc']);

    return { questions, answers: sortedAnswers };
}

export async function sendResonatorAnswer({resonator_id, question_id, answer_id, sent_resonator_id}) {
    const [resonator, resonatorStats, sentResonator] = await Promise.all([
        resonatorRepository.findById(resonator_id),
        resonatorStatsRepository.findById(resonator_id),
        sentResonatorRepository.findById(sent_resonator_id)
    ]);

    if (!resonatorStats || !sentResonator || !resonator)
        return null;

    const resonator_question_id = resonator.getResonatorQuestionId(question_id);

    resonatorStats.addAnswer({
        resonator_question_id,
        question_id,
        answer_id,
        sent_resonator_id
    });

    await getUow().commit();

    return true;
}
