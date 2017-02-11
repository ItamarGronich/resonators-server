import _ from 'lodash';
import {followers, users, leaders} from '../db/sequelize/models';
import followerRepository from '../db/repositories/FollowerRepository';
import User from '../domain/entities/user';
import Follower from '../domain/entities/follower';
import * as dtoFactory from './dto/index';
import getUow from './getUow';

export async function getLeaderFollowers(user_id) {
    const followers = await followerRepository.findByLeaderUserId(user_id);
    const followersDto = followers.map(dtoFactory.toFollower);
    return followersDto;
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
    return dtoFactory.toFollower(newFollower);
}
