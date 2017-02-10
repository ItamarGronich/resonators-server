import User from '../domain/entities/user';
import Follower from '../domain/entities/follower';
import Resonator from '../domain/entities/resonator';
import userRepository from '../db/repositories/UserRepository';
import followerRepository from  '../db/repositories/UserRepository';
import resonatorRepository from  '../db/repositories/ResonatorRepository';

export default function getEntityRepository(entity) {
    if (entity.constructor === User)
        return userRepository;

    if (entity.constructor === Follower)
        return followerRepository;

    if (entity.constructor === Resonator)
        return resonatorRepository;

    throw new Error(`No repository was found matching the entity ${entity.constructor.name}`);
}
