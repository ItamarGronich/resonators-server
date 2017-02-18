import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {questions, answers} from '../sequelize/models';

class QuestionRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(question) {
        return {
            ...question
        };
    }

    async save(question) {
        return await questions.create(question, {transaction});
    }

    async findById(id) {
        const dbQuestion = await questions.findOne({
            where: {id},
            include: [answers]
        });

        if (!dbQuestion)
            return null;

        const question = dbToDomain.toQuestion(dbQuestion);

        this.trackEntity(question);

        return question;
    }

    async findByClinic(clinic_id) {
        const rows = await questions.find({
            where: {clinic_id},
            include: this.getInclude()
        });

        if (!rows)
            return null;

        const questions = rows.map(dbToDomain.toQuestion);
        questions.forEach(q => this.trackEntity(q));
        return questions;
    }

    async findByLeader(leader_id) {
        const rows = await questions.find({
            where: {leader_id},
            include: this.getInclude()
        });

        if (!rows)
            return null;

        const questions = rows.map(dbToDomain.toQuestion);
        questions.forEach(q => this.trackEntity(q));
        return questions;
    }

    getInclude() {
        return [answers];
    }
}

export default new QuestionRepository();
