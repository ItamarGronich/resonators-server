import uuid from 'uuid/v4';

export default class ResonatorStats {
    constructor({
        resonator_id,
        criteria
    }) {
        this.resonator_id = resonator_id;
        this.criteria = criteria;
    }

    addAnswer({question_id, resonator_question_id, sent_resonator_id, answer_id}) {
        const answers = this.criteria[question_id] || [];

        answers.push({
            id: uuid(),
            resonator_question_id,
            sent_resonator_id,
            answer_id
        });
    }
}
