import _ from 'lodash';
import {followers, users, leaders} from '../db/sequelize/models';
import followerRepository from '../db/repositories/FollowerRepository';

export async function getLeaderFollowers(user_id) {
    const followers = await followerRepository.findByLeaderUserId(user_id);
    return followers;
}
