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
    const currentResonator = await resonatorRepository.findByPk(resonatorId);
    const allResonators = currentResonator.follower_group_id ?
        await resonatorRepository.findChildrenById(resonatorId) :
        [currentResonator];
    const allStats = [];
    for (const resonator of allResonators) {
        const { name } = await userRepository.findByFollowerId(resonator.follower_id);
        const stats = await resonatorStatsRepository.findByPk(resonator.id);
        const questionIds = _.map(stats.criteria, (v, qid) => qid);
        const questions = await questionRepository.findManyById(questionIds);

        const answersMap = _.flatMap(questions, 'answers').reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});
        const answers = await Promise.all(_(stats.criteria)
            .map((arr, question_id) =>
                _.map(arr, async a => {
                    const sentResonator = await sentResonatorRepository.findByPk(a.sent_resonator_id);
                    return {
                        question_id,
                        rank: _.get(answersMap[a.answer_id], 'rank'),
                        answerBody: _.get(answersMap[a.answer_id], 'body'),
                        time: (sentResonator) ? sentResonator.createdAt : a.createdAt,
                        time_answered: a.createdAt,
                        order: a.order,
                        resonator: resonator.title,
                    }
                })
            )
            .reduce((acc, cur) => acc.concat(cur), []));

        const sortedAnswers = _.orderBy(answers, a => a.time, ['desc']);
        sortedAnswers.forEach((a) => {
            const question = questions.find(q => q.id === a.question_id);
            question.order = a.order;
            question.tooltip = question.question_kind === 'text' ? a.answerBody : "";
            a.tooltip = question.tooltip;
        });
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

export async function getResonator(resonatorId) {
    const resonator = await resonatorRepository.findByPk(resonatorId);

    return { resonator };
}

export async function sendResonatorAnswer({ resonator_id, question_id, answer_id, sent_resonator_id }) {
    const [resonator, resonatorStats, sentResonator] = await Promise.all([
        resonatorRepository.findByPk(resonator_id),
        resonatorStatsRepository.findByPk(resonator_id),
        sentResonatorRepository.findByPk(sent_resonator_id)
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

export async function getResonatorCSVData(resonatorId) {
    const sentResonators = await sentResonatorRepository.findDataByResonatorId(resonatorId);

    return sentResonators.map((sent_resonator) => {
        const header = {
            Resonator: sent_resonator.resonator.title,
            Follower: sent_resonator.resonator.follower?.user?.name
        };
        const answers = {Resonator: "", Follower: ""};

        sent_resonator.resonator.resonator_questions.sort((a, b) => a.order - b.order);

        sent_resonator.resonator.resonator_questions.map((resonator_question) => {
            const rank = (resonator_question.resonator_answers[0]?.answer?.rank >= 0) ? " (Rank: " + resonator_question.resonator_answers[0]?.answer?.rank + ")" : "";
            header[resonator_question.question.title] = resonator_question.question.description + rank;
            const answer = resonator_question.resonator_answers?.find(ra => ra.dataValues.sentResonatorId === sent_resonator.dataValues.id && ra.dataValues.resonator_quest === resonator_question.dataValues.id)?.answer;
            answers[resonator_question.question.title] = answer?.body || answer?.rank;
        });
        sent_resonator.resonator.resonator_questions.map((resonator_question, i) => {
            const questionNumber = i + 1;
            header["Time-Reply"+questionNumber] = "Time-Reply"+questionNumber;
            answers["Time-Reply"+questionNumber] = resonator_question.resonator_answers?.find(ra => ra.dataValues.sentResonatorId === sent_resonator.dataValues.id && ra.dataValues.resonator_quest === resonator_question.dataValues.id)?.createdAt;
        });

        return [header, answers];
    });
}

export async function getGroupCSVData(followerGroupId) {
    const resonators = await resonatorRepository.findByFollowerGroupId(followerGroupId);

    return resonators.map(async (resonator) => await getResonatorCSVData(resonator.id)).flat();
}

export function convertStatsToCSV(sentResonators) {
    return sentResonators.map((sentResonator) => {
        return toCSV(sentResonator);
    });
}


export async function getResonatorStatsFileName(resonatorId) {
    const resonator = await resonatorRepository.findByPk(resonatorId);
    if (!resonator) return null;
    const resonatorTitle = resonator.title;
    const targetName =
        (resonator.follower_id && (await userRepository.findByFollowerId(resonator.follower_id)).name) ||
        (resonator.follower_group_id && (await FollowerGroupRepository.findByPk(resonator.follower_group_id)).group_name);
    const date = (new Date()).toLocaleDateString("en-US");
    const fields = [resonatorTitle, targetName, date].map((field) => field.substring(0, 20));
    return `${fields.join('-')}.csv"`;
}

export async function getGroupStatsFileName(followerGroupId) {
    const groupName = (await FollowerGroupRepository.findByPk(followerGroupId)).group_name;
    const date = (new Date()).toLocaleDateString("en-US");
    const fields = [groupName, date].map((field) => field.substring(0, 20));
    return `${fields.join('-')}.csv"`;
}
