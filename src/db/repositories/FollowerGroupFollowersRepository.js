import Repository from './Repository';
import {follower_group_followers} from '../sequelize/models';
import * as dbToDomain from '../dbToDomain';

class FollowerGroupFollowersRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(followerGroupFollower) {
        return {
            ...followerGroupFollower
        };
    }

    save(followerGroupFollower, transaction) {
        return follower_group_followers.create(followerGroupFollower, {transaction});
    }
}

export default new FollowerGroupFollowersRepository();
