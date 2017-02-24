import _ from 'lodash';
import {clinics} from '../db/sequelize/models';
import questionsRepository from '../db/repositories/QuestionRepository';
import Question from '../domain/entities/question';
import * as dtoFactory from './dto';
import getUow from './getUow';
import updatePermittedFields from './updatePermittedFields';

export async function getLeaderClinics(user_id) {
    const rows = await clinics.findAll({
        where: {
            user_id
        }
    });

    const foundClinics = rows.map(r => ({
        id: r.get('id'),
        user_id: r.get('user_id'),
        name: r.get('name'),
        created_at: r.get('created_at'),
        updated_at: r.get('updated_at'),
    }));

    return foundClinics;
}

export async function getLeaderClinicsCriteria(leader_id, clinic_id) {
    let questions;

    if (!clinic_id)
        questions = await questionsRepository.findByLeader(leader_id);
    else
        questions = await questionsRepository.findByClinic(clinic_id);

    return _(questions)
            .map(dtoFactory.toQuestion)
            .orderBy(q => q.created_at, 'desc')
            .value();
}

export async function addQuestionToClinic(clinic_id, leader_id, questionRequest) {
    const uow = getUow();

    const question = new Question({
        ...questionRequest,
        clinic_id,
        leader_id
    });

    uow.trackEntity(question, {isNew: true});

    await uow.commit();

    const savedQuestion = await questionsRepository.findById(question.id);

    return dtoFactory.toQuestion(savedQuestion);
}

export async function updateQuestion(questionRequest) {
    const uow = getUow();

    const question = await questionsRepository.findById(questionRequest.id);

    if (!question)
        return null;

    updatePermittedFields(question, questionRequest, [
        'clinic_id',
        'description',
        'title',
        'question_kind'
    ]);

    question.updateAnswers(questionRequest.answers);

    await uow.commit();

    const savedQuestion = await questionsRepository.findById(question.id);
    return dtoFactory.toQuestion(savedQuestion);
}
