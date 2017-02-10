import _ from 'lodash';
import {resonators} from '../db/sequelize/models';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import * as dtoFactory from './dto/index';

export async function getResonators(followerId) {
    const resonators = await resonatorRepository.findByFollowerId(followerId);
    const resonatorsDto = resonators.map(dtoFactory.toResonator);
    return resonatorsDto;
}
