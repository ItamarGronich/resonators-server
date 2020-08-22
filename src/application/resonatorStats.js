import _ from 'lodash';
import resonatorStatsRepository from '../db/repositories/ResonatorStatsRepository';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import userRepository from '../db/repositories/UserRepository';
import questionRepository from '../db/repositories/QuestionRepository';
import sentResonatorRepository from '../db/repositories/SentResonatorRepository';
import * as dtoFactory from './dto';
import getUow from './getUow';
import { toCSV, uniqFlatten } from './utils';
import FollowerGroupRepository from '../db/repositories/FollowerGroupRepository';


export async function getResonatorStats(resonatorId) {
    const currentResonator = await resonatorRepository.findById(resonatorId);
    const allResonators = currentResonator.follower_group_id ?
        await resonatorRepository.findChildrenById(resonatorId) :
        [currentResonator];
    let allStats = []
    for (const resonator of allResonators) {
        const { name } = await userRepository.findByFollowerId(resonator.follower_id);
        const stats = await resonatorStatsRepository.findById(resonator.id);
        const questionIds = _.map(stats.criteria, (v, qid) => qid);
        const questions = await questionRepository.findManyById(questionIds);

        const answersMap = _.flatMap(questions, 'answers').reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        const answers = _(stats.criteria)
            .map((arr, question_id) => _.map(arr, a => ({
                question_id, rank: _.get(answersMap[a.answer_id], 'rank'), time: a.created_at
            })))
            .reduce((acc, cur) => acc.concat(cur), []);

        const sortedAnswers = _.orderBy(answers, a => a.time, ['desc']);
        allStats.push({
            questions,
            answers: sortedAnswers.map((answer) => ({
                followerName: name,
                ...answer,
            }))
        });
    }
    const finalStats = {
        questions: uniqFlatten(allStats.map(({ questions }) => questions)),
        answers: uniqFlatten(allStats.map(({ answers }) => answers)),
    }

    return finalStats;
}

export async function sendResonatorAnswer({ resonator_id, question_id, answer_id, sent_resonator_id }) {
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

    const resonatorDto = dtoFactory.toResonator(resonator);

    return {
        resonator: resonatorDto
    };
}

export function convertStatsToCSV({ questions, answers }) {
    return toCSV(answers.map((answer) => {
        const question = questions.find(_.matches({ id: answer.question_id }));
        return {
            followerName: answer.followerName,
            title: question.title,
            description: question.description,
            rank: answer.rank,
            time: answer.time,
        };
    }));
}

export async function getStatsFileName(resonatorId) {
    const resonator = await resonatorRepository.findById(resonatorId);
    if (!resonator) return null;
    const resonatorTitle = resonator.title;
    const targetName =
        (resonator.follower_id && (await userRepository.findByFollowerId(resonator.follower_id)).name) ||
        (resonator.follower_group_id && (await FollowerGroupRepository.findById(resonator.follower_group_id)).group_name);
    const date = (new Date()).toLocaleDateString("en-US");
    const fields = [resonatorTitle, targetName, date].map((field) => field.substring(0, 20));
    return `${fields.join('-')}.csv"`;
}
