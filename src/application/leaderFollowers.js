import _ from 'lodash';
import {followers, users, leaders} from '../db/sequelize/models';
import followerRepository from '../db/repositories/FollowerRepository';
import * as dtoFactory from './dto/index';

export async function getLeaderFollowers(user_id) {
    const followers = await followerRepository.findByLeaderUserId(user_id);
    const followersDto = followers.map(dtoFactory.toFollower);
    return followersDto;
}
