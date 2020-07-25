import log from '../infra/log';
import followerRepository from '../db/repositories/FollowerRepository';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import leaderRepository from '../db/repositories/LeaderRepository';
import userRepository from '../db/repositories/UserRepository';
import User from '../domain/entities/user';
import Follower from '../domain/entities/follower';
import * as dtoFactory from './dto/index';
import getUow from './getUow';

export async function getLeaderFollowers(user_id) {
    const followers = await followerRepository.findByLeaderUserId(user_id);
    const followersDto = followers.map(dtoFactory.toFollower);
    return followersDto;
}

export async function getLeader(leader_id) {
    const leader = await leaderRepository.findById(leader_id);
    const dto = dtoFactory.toLeader(leader);
    return dto;
}
export async function addLeaderFollower({leader_id, clinic_id, email, name, password}) {
    const user = new User({name, email, pass: password});

    const follower = new Follower({
        user_id: user.id,
        leader_id,
        clinic_id,
        status: 2
    });

    const uow = getUow();

    uow.trackEntity(user, {isNew: true});
    uow.trackEntity(follower, {isNew: true});

    await uow.commit();

    const newFollower = await followerRepository.findById(follower.id);
    const followerDto = dtoFactory.toFollower(newFollower);
    return {
        ...followerDto,
        user: {
            name, email
        }
    };
}

export async function deleteLeaderFollower(followerId) {
    return await Promise.all([
        followerRepository.deleteById(followerId),
        resonatorRepository.deleteByFollowerId(followerId)
    ]);
}

export async function updateFollowerUser(followerId, newUserDetails) {
    const user = await userRepository.findByFollowerId(followerId);
    user.email = newUserDetails.email;
    user.name = newUserDetails.name;
    await getUow().commit();
}

export async function freezeFollower(followerId) {
    const follower = await followerRepository.findById(followerId);

    if (follower) {
        log.info('freezing follower', followerId);
        follower.freeze();
        await getUow().commit();
        return true;
    }
}

export async function unfreezeFollower(followerId) {
    const follower = await followerRepository.findById(followerId);

    if (follower) {
        log.info('unfreezing follower', followerId);
        follower.unfreeze();
        await getUow().commit();
        return true;
    }
}
