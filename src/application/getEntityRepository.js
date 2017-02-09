import User from '../domain/entities/user';
import Follower from '../domain/entities/follower';
import userRepository from '../db/repositories/UserRepository';
import followerRepository from  '../db/repositories/UserRepository';

export default function getEntityRepository(entity) {
    if (entity.constructor === User)
        return userRepository;

    if (entity.constructor === Follower)
        return followerRepository;
}
