import resonatorStatsRepository from '../db/repositories/ResonatorStatsRepository';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import sentResonatorRepository from '../db/repositories/SentResonatorRepository';
import getUow from './getUow';

export async function getResonatorStats(resonatorId) {
    return await resonatorStatsRepository.findById(resonatorId);
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
