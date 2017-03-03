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
        let answers = this.criteria[question_id];

        if (!answers)
            answers = this.criteria[question_id] = [];

        if (answers.find(a => a.sent_resonator_id === sent_resonator_id)) {
            console.log(`trying to add an answer with an existing sent_resonator_id: ${sent_resonator_id}`, );
            return;
        }

        answers.unshift({
            id: uuid(),
            resonator_question_id,
            sent_resonator_id,
            answer_id
        });
    }
}
