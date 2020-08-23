import User from '../domain/entities/user';
import Question from '../domain/entities/question';
import Follower from '../domain/entities/follower';
import FollowerGroup from '../domain/entities/followerGroup';
import FollowerGroupFollower from '../domain/entities/followerGroupFollower';
import Resonator from '../domain/entities/resonator';
import Leader from '../domain/entities/leader';
import Clinic from '../domain/entities/clinic';
import LeaderClinic from '../domain/entities/leaderClinic';
import SentResonator from '../domain/entities/sentResonator';
import ResonatorStats from '../domain/entities/resonatorStats';
import GoogleAccount from '../domain/entities/googleAccount';
import LeaderCalendar from '../domain/entities/leaderCalendar';
import userRepository from '../db/repositories/UserRepository';
import leadersRepository from  '../db/repositories/LeaderRepository';
import clinicsRepository from  '../db/repositories/ClinicRepository';
import followerRepository from  '../db/repositories/FollowerRepository';
import followerGroupRepository from  '../db/repositories/FollowerGroupRepository';
import followerGroupFollowerRepository from  '../db/repositories/FollowerGroupFollowersRepository';
import resonatorRepository from  '../db/repositories/ResonatorRepository';
import questionRepository from '../db/repositories/QuestionRepository';
import resonatorStatsRepository from '../db/repositories/ResonatorStatsRepository';
import sentResonatorRepository from '../db/repositories/SentResonatorRepository';
import googleAccountsRepository from '../db/repositories/GoogleAccountRepository';
import leaderCalendarsRepository from '../db/repositories/LeaderCalendarsRepository';
import leadersClinicsRepository from  '../db/repositories/LeaderClinicsRepository';


export default function getEntityRepository(entity) {
    if (entity.constructor === User)
        return userRepository;

    if (entity.constructor === Leader)
        return leadersRepository;

    if (entity.constructor === Clinic)
        return clinicsRepository;

    if (entity.constructor === Follower)
        return followerRepository;

    if (entity.constructor === FollowerGroup)
        return followerGroupRepository;

    if (entity.constructor === FollowerGroupFollower)
        return followerGroupFollowerRepository;

    if (entity.constructor === Resonator)
        return resonatorRepository;

    if (entity.constructor === Question)
        return questionRepository;

    if (entity.constructor === ResonatorStats)
        return resonatorStatsRepository;

    if (entity.constructor === SentResonator)
        return sentResonatorRepository;

    if (entity.constructor === GoogleAccount)
        return googleAccountsRepository;

    if (entity.constructor === LeaderCalendar)
        return leaderCalendarsRepository;

    if (entity.constructor == LeaderClinic)
        return leadersClinicsRepository;

    throw new Error(`No repository was found matching the entity ${entity.constructor.name}`);
}
