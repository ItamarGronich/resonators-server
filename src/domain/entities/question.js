import { v4 as uuid } from "uuid";
import Answer from './answer';
import {answers} from "../../db/sequelize/models";

export default class Question {
    constructor({
        id,
        leader_id,
        clinic_id,
        question_kind,
        description,
        title,
        tags,
        is_system,
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
        this.tags = tags;
        this.is_system = is_system;
        this.removed = removed || false;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        this.answers = answers.map(a => {
            if (a.constructor === Answer)
                return a;

            return new Answer(a);
        });
    }

    async updateAnswers(newAnswers = []) {
        await newAnswers.forEach(async (newAnswer) => {
            const answer = await answers.findOne({
                where: {
                    id: this.answers.find(old => old.rank === newAnswer.rank).id
                }
            });

            if (answer) {
                answer.body = newAnswer.body;
                answer.save();
            }
        });
        this.answers =newAnswers.map(a => ({
            id: this.answers.find(old => old.rank === a.rank).id,
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
