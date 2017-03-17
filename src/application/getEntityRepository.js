import User from '../domain/entities/user';
import Question from '../domain/entities/question';
import Follower from '../domain/entities/follower';
import Resonator from '../domain/entities/resonator';
import Leader from '../domain/entities/leader';
import Clinic from '../domain/entities/clinic';
import SentResonator from '../domain/entities/sentResonator';
import VersionableAsset from '../domain/entities/versionableAsset';
import ResonatorStats from '../domain/entities/resonatorStats';
import userRepository from '../db/repositories/UserRepository';
import leadersRepository from  '../db/repositories/LeaderRepository';
import clinicsRepository from  '../db/repositories/ClinicRepository';
import followerRepository from  '../db/repositories/FollowerRepository';
import resonatorRepository from  '../db/repositories/ResonatorRepository';
import questionRepository from '../db/repositories/QuestionRepository';
import resonatorStatsRepository from '../db/repositories/ResonatorStatsRepository';
import sentResonatorRepository from '../db/repositories/SentResonatorRepository';
import versionableAssetsRepository from '../db/repositories/VersionableAssetsRepository';

export default function getEntityRepository(entity) {
    if (entity.constructor === User)
        return userRepository;

    if (entity.constructor === Leader)
        return leadersRepository;

    if (entity.constructor === Clinic)
        return clinicsRepository;

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

    if (entity.constructor === VersionableAsset)
        return versionableAssetsRepository;

    throw new Error(`No repository was found matching the entity ${entity.constructor.name}`);
}
