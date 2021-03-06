import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {questions, answers, clinics, leaders, users} from '../sequelize/models';
const { Op } = require("sequelize");
import addRemoveChangedEntities from './addedRemovedEntities';

class QuestionRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(question) {
        return {
            ...question
        };
    }

    toAnswersDbEntities(question = {answers: []}) {
        return question.answers.map(a => ({
            ...a,
            question_id: question.id
        }));
    }

    async save(question, transaction, lastQuestion) {
        const self = this;
        const questionPromise = questions.upsert(question, {transaction});

        const addRemovedAnswersPromises = addRemoveChangedEntities({
            currentGroup: self.toAnswersDbEntities(question),
            previousGroup: self.toAnswersDbEntities(lastQuestion),
            dbModel: answers,
            transaction
        });

        return Promise.all([questionPromise, ...addRemovedAnswersPromises]);
    }

    async findByPk(id) {
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
        const rows = await questions.findAll({
            [Op.or]: [
                { clinic_id },
                { is_system: true }
            ],
            include: this.getInclude()
        });

        if (!rows)
            return null;

        const questionEntities = rows.map(dbToDomain.toQuestion);
        questionEntities.forEach(q => this.trackEntity(q));
        return questionEntities;
    }

    async findByLeader(leader_id) {
        const rows = await questions.findAll({
            where: {
                [Op.or]: [
                    { "$clinic.user.leader.id$": leader_id },
                    { is_system: true }
                ],
            },
            include: [
                ...this.getInclude(),
                {
                    model: clinics,
                    include: [{
                        model: users,
                        include: [leaders],
                    }],
                },
            ]
        });

        if (!rows)
            return null;

        const questionEntities = rows.map(dbToDomain.toQuestion);
        questionEntities.forEach(q => this.trackEntity(q));
        return questionEntities;
    }

    async findManyById(ids) {
        const rows = await questions.findAll({
            where: {id: ids},
            include: this.getInclude()
        });

        if (!rows)
            return null;

        const questionEntities = rows.map(dbToDomain.toQuestion);
        questionEntities.forEach(q => this.trackEntity(q));
        return questionEntities;
    }

    getInclude() {
        return [answers];
    }
}

export default new QuestionRepository();
