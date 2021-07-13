import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
const { Op } = require("sequelize");
import {sent_resonators, resonators, resonator_questions, questions, resonator_answers, answers, followers, users} from '../sequelize/models';

class SentResonatorRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(sentResonator) {
        return {
            ...sentResonator
        };
    }

    async save(sentResonator, transaction) {
        return await sent_resonators.create(sentResonator, {transaction});
    }

    async findByPk(id) {
        const row = await sent_resonators.findByPk(id);

        if (!row)
            return null;

        const sentResonator = dbToDomain.toSentResonator(row);
        this.trackEntity(sentResonator);
        return sentResonator;
    }

    async findDataByResonatorId(resonator_id) {
        const rows = await sent_resonators.findAll({
            include: {
                model: resonators,
                where: {
                    [Op.or]: [
                        { id: resonator_id },
                        { parent_resonator_id: resonator_id }
                    ]
                },
                required: true,
                include: [
                    {
                        model: resonator_questions,
                        include: [
                            questions,
                            {
                                model: resonator_answers,
                                include: [answers]
                            }
                        ]
                    },
                    {
                        model: followers,
                        include: [users]
                    }
                ]
            }
        });

        return rows || null;
    }
}

export default new SentResonatorRepository();
