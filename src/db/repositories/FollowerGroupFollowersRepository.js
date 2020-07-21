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

    async delete(followerGroupId, followerId) {
        return await follower_group_followers.destroy({
            where: {
                follower_group_id: followerGroupId,
                follower_id: followerId,
            }
        });
    }
}

export default new FollowerGroupFollowersRepository();
