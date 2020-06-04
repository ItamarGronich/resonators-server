import {questions} from '../../src/db/sequelize/models';
import {fooLeader} from './leaders';
import {clinic} from './clinics';

export default () => {
    return questions.create(question1);
};

export const question1 = {
    id: '8b40d070-af85-4213-afbb-31471acad67b',
    leader_id: fooLeader.id,
    question_kind: 'numeric',
    description: 'description',
    title: 'title',
    removed: false,
    clinic_id: clinic.id
};
