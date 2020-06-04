import {answers} from '../../src/db/sequelize/models';
import {question1} from './questions';

export default () => {
    return answers.create(question1Answer1);
};

export const question1Answer1 = {
    id: 'a98d5649-e724-4424-9f0e-ea060a579be4',
    question_id: question1.id,
    body: 'answer',
    rank: 1
};
