import _ from 'lodash';
import {clinics} from '../db/sequelize/models';
import {leaders} from '../db/sequelize/models';
import {users} from '../db/sequelize/models';
import questionsRepository from '../db/repositories/QuestionRepository';
import Question from '../domain/entities/question';
import * as dtoFactory from './dto';
import getUow from './getUow';
import updatePermittedFields from './updatePermittedFields';
import {leader_clinics} from '../db/sequelize/models';
import LeaderClinic from '../domain/entities/leaderClinic';
import { v4 as uuid } from 'uuid';
import s3 from '../s3';
import log from '../logging';
import { uow } from '../api/middleware';

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
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt'),
    }));

    return foundClinics;
}
// This has to be removed after database update
export async function UpsertLeaderClinics() {
    
    const crows = await clinics.findAll();
    const allClinics = crows.map(r => r.dataValues);

    const lrows = await leaders.findAll();
    const allLeaders = lrows.map(r => r.dataValues);

    const lClinics = await leader_clinics.findAll();
    const allLeaderClinics = lClinics.map(r => r.dataValues);

    const uow = getUow();
    allClinics.forEach(element => {
        var leader = allLeaders.find(function(ele){
            if(element.user_id == ele.user_id)
                return ele;
        });

        var leaderClinicExist = allLeaderClinics.find(function(ele){
            if(ele.clinic_id == element.id && ele.leader_id == leader.id)
                return true;
        });

        if(leaderClinicExist === undefined)
        {
            var leaderClinic = new LeaderClinic({
            id: uuid(),
            leader_id : leader.id,
            clinic_id : element.id,
            is_primary : true,
            is_leader_accepted: false
            });

            uow.trackEntity(leaderClinic, {isNew: true});
        }      
    });
    await uow.commit();
}
// This has to be removed after database update
export async function UpdateCurrentClinicId() {
    
    const crows = await clinics.findAll();
    const allClinics = crows.map(r => r.dataValues);

    const lrows = await leaders.findAll();
    const allLeaders = lrows.map(r => r.dataValues);

    var uow = getUow();
    allClinics.forEach(async element => {
        var templeader = allLeaders.find(function(ele){
            if(element.user_id == ele.user_id)
                return ele;
        });

        var id=templeader.id;
        leaders.update({
            current_clinic_id: element.id,
          }, {
            where: {
              id: id
            }
          }
        );
    });

}

export async function getLeaderClinicsIncludingSecondary(leader_id) {
    const rows = await leader_clinics.findAll({
        where: {
            leader_id: leader_id
        },
        include: [clinics, leaders]
    });
    
    const foundClinics = rows.map(r => ({
        id: r.get('clinic_id'),
        user_id: r.get('leader_id'),
        name: r.get('clinic').get('name'),
        phone: r.get('clinic').get('phone'),
        website: r.get('clinic').get('website'),
        logo: r.get('clinic').get('logo'),
        qr: r.get('clinic').get('qr'),
        therapistPicture: r.get('leader').get('photo'),
        therapistName: r.get('leader').get('title'),
        is_primary: r.get('is_primary'),
        is_leader_accepted: r.get('is_leader_accepted'),
        isCurrentClinic: r.get('clinic_id') == r.get('leader').get('current_clinic_id'),
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt'),
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
            .orderBy(q => q.title, 'asc')
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

    const savedQuestion = await questionsRepository.findByPk(question.id);

    return dtoFactory.toQuestion(savedQuestion);
}
export async function addLeaderToClinic(leaderClinic) {
    const uow = getUow();
    const dbLeader = await leaders.findOne({
        include: [{
            model: users,
            where: {
                email: leaderClinic.email
            }
        }]
    });

    if(dbLeader){
        var leaderClinic = new LeaderClinic({
            id: uuid(),
            leader_id : dbLeader.get('id'),
            clinic_id : leaderClinic.clinic_id,
            is_primary : false,
            is_leader_accepted: true
            });

            uow.trackEntity(leaderClinic, {isNew: true});
            uow.commit();
    }
}
export async function updateQuestion(questionRequest) {
    const uow = getUow();

    const question = await questionsRepository.findByPk(questionRequest.id);

    if (!question)
        return null;

    updatePermittedFields(question, questionRequest, [
        'clinic_id',
        'description',
        'title',
        'question_kind',
        'tags',
        'is_system'
    ]);

    await question.updateAnswers(questionRequest.answers);

    await uow.commit();

    const savedQuestion = await questionsRepository.findByPk(question.id);
    return dtoFactory.toQuestion(savedQuestion);
}

export async function freezeCriterion(questionRequest) {   
    const uow = getUow();
    const question = await questionsRepository.findByPk(questionRequest);

    if (question) {      
        await question.freeze();
        await uow.commit();
        const savedQuestion = await questionsRepository.findByPk(question.id);
        return dtoFactory.toQuestion(savedQuestion);
    }
}

export async function unfreezeCriterion(questionRequest) {    
    const uow = getUow();
    const question = await questionsRepository.findByPk(questionRequest);

    if (question) {      
        await question.unfreeze();
        await uow.commit();
        const savedQuestion = await questionsRepository.findByPk(question.id);
        return dtoFactory.toQuestion(savedQuestion);
    }
}

export async function saveClinicSettings(leader_id, {name, logo, QRImage, therapistPicture, therapistName, phone, website}) {
    const uow = getUow();
    const leaderClinic = await leader_clinics.findOne({
        where: {
            leader_id: leader_id,
            is_primary: true
        },
        include: [clinics, leaders]
    });

    const activeClinic = leaderClinic?.dataValues?.clinic;
    const leader = leaderClinic?.dataValues?.leader;
    if (!activeClinic || !leader) return false;

    const activeClinicFields = {
        name: name,
        phone,
        website,
    };
    if (logo === null) activeClinicFields.logo = null;
    if (QRImage === null) {
        activeClinicFields.qr = null;
    } else if (QRImage) {
        const { Location } = await s3.uploadImage(uuid(), Buffer.from(QRImage.replace(/^data:image\/\w+;base64,/, ""), 'base64'));
        activeClinicFields.qr = Location;
    }

    updatePermittedFields(activeClinic, activeClinicFields, [
        'name',
        'logo',
        'phone',
        'website',
        'qr'
    ]);

    const leaderFields = {
        title: therapistName
    };
    if (therapistPicture === null) leaderFields.photo = null;
    updatePermittedFields(leader, leaderFields, [
        'photo',
        'title'
    ]);

    activeClinic.save();
    leader.save();
    await uow.commit();

    return {activeClinic, leader};
}

export async function uploadClinicMedia(leader_id, fieldName, file) {
    const uow = getUow();
    const leaderClinic = await leader_clinics.findOne({
        where: {
            leader_id: leader_id,
            is_primary: true
        },
        include: [clinics, leaders]
    });

    const activeClinic = leaderClinic?.dataValues?.clinic;
    const leader = leaderClinic?.dataValues?.leader;
    if (!activeClinic || !leader) return false;

    const { Location } = await s3.uploadImage(uuid(), file);

    switch (fieldName) {
        case 'logo':
            updatePermittedFields(activeClinic, {logo: Location}, ['logo']);
            activeClinic.save();
        break;
        case 'therapistPicture':
            updatePermittedFields(leader, {photo: Location}, ['photo']);
            leader.save();
        break;
    }
    await uow.commit();
    return true;
}
