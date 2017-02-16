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
        const question = await questions.findOne({
            where: {id},
            include: [answers]
        });

        if (!question)
            return null;

        return dbToDomain.toQuestion(question);
    }
}

export default new QuestionRepository();
