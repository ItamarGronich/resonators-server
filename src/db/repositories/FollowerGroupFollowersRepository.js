import Repository from './Repository';
import {follower_group_followers, follower_groups, followers} from '../sequelize/models';
import * as dbToDomain from '../dbToDomain';
import * as R from 'ramda';


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

    async findFollowersByGroupId(followerGroupId) {
        const rows = await follower_group_followers.findAll({
            where: {
                follower_group_id: followerGroupId
            },
        });

        const foundFollowers = await Promise.all(R.map( async (followerGroupFollower) =>
            await followers.findOne({
                where: {
                    follower_id: followerGroupFollower.follower_id
                },
            })), rows);

        if (!foundFollowers) {
            return [];
        }

        const groupFollowers = foundFollowers.map(dbToDomain.toFollower);
        groupFollowers.forEach(follower => this.trackEntity(follower));
        return groupFollowers;
    }

    async findGroupsByFollowerId(followerId) {
        const rows = await follower_group_followers.findAll({
            where: {
                follower_id: followerId
            },
        });

        const foundGroups = await Promise.all(R.map( async (followerGroupFollower) =>
            await follower_groups.findOne({
                where: {
                    follower_group_id: followerGroupFollower.follower_group_id
                },
            })), rows);

        if (!foundGroups) {
            return [];
        }

        const groups = foundGroups.map(dbToDomain.toFollowerGroup);
        groups.forEach(group => this.trackEntity(group));
        return groups;
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
