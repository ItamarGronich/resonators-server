import { v4 as uuid } from "uuid";
import Answer from './answer';

export default class Question {
    constructor({
        id,
        leader_id,
        clinic_id,
        question_kind,
        description,
        title,
        removed,
        answers = [],
        createdAt,
        updatedAt
    }) {
        this.id = id || uuid();
        this.leader_id = leader_id;
        this.clinic_id = clinic_id;
        this.question_kind = question_kind;
        this.description = description;
        this.title = title;
        this.removed = removed || false;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        this.answers = answers.map(a => {
            if (a.constructor === Answer)
                return a;

            return new Answer(a);
        });
    }

    updateAnswers(answers = []) {
        this.answers = answers.map(a => ({
            id: uuid(),
            ...a
        }));
    }

    freeze() {
        this.removed = true;
    }

    unfreeze() {
        this.removed = false;
    }
}
