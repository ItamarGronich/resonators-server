import {resonator_questions} from '../../src/db/sequelize/models';
import {question1} from './questions';
import {resonator} from './resonators';

export default () => {
    return resonator_questions.create(resonatorQuestion1);
};

export const resonatorQuestion1 = {
    id: 'e676944d-b340-430b-9f42-0e113be2d62a',
    question_id: question1.id,
    resonator_id: resonator.id,
    removed: false
};
