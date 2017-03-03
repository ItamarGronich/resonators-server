import User from '../domain/entities/user';
import Question from '../domain/entities/question';
import Follower from '../domain/entities/follower';
import Resonator from '../domain/entities/resonator';
import SentResonator from '../domain/entities/sentResonator';
import ResonatorStats from '../domain/entities/resonatorStats';
import userRepository from '../db/repositories/UserRepository';
import followerRepository from  '../db/repositories/FollowerRepository';
import resonatorRepository from  '../db/repositories/ResonatorRepository';
import questionRepository from '../db/repositories/QuestionRepository';
import resonatorStatsRepository from '../db/repositories/ResonatorStatsRepository';
import sentResonatorRepository from '../db/repositories/SentResonatorRepository';

export default function getEntityRepository(entity) {
    if (entity.constructor === User)
        return userRepository;

    if (entity.constructor === Follower)
        return followerRepository;

    if (entity.constructor === Resonator)
        return resonatorRepository;

    if (entity.constructor === Question)
        return questionRepository;

    if (entity.constructor === ResonatorStats)
        return resonatorStatsRepository;

    if (entity.constructor === SentResonator)
        return sentResonatorRepository;

    throw new Error(`No repository was found matching the entity ${entity.constructor.name}`);
}
