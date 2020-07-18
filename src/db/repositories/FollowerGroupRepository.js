import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {follower_groups, users, leaders} from '../sequelize/models';

class FollowerGroupRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(followerGroup) {
        return {
            ...followerGroup
        };
    }

    save(followerGroup, transaction) {
        return follower_groups.upsert(followerGroup, {transaction});
    }

    async findByLeaderUserId(leaderUserId) {
        const user = await users.findOne({
            where: {id: leaderUserId},

            include: [{
                model: leaders,
                include: [{
                    model: follower_groups,
                    include: [{
                        model: users,
                        required: true
                    }]
                }]
            }]
        });

        if (!_.get(user, 'leader.follower_groups'))
            return [];

        const foundFollowerGroups = user.leader.follower_groups.map(dbToDomain.toFollowerGroup);

        foundFollowerGroups.forEach(followerGroup => this.trackEntity(followerGroup));

        return foundFollowerGroups;
    }

    async findById(id) {
        const row = await follower_groups.findById(id);

        if (!row)
            return null;

        const follower_group = dbToDomain.toFollowerGroup(row);

        this.trackEntity(follower_group);

        return follower_group;
    }

    async deleteById(id) {
        return await follower_groups.destroy({
            where: {
                id
            }
        });
    }
}

export default new FollowerGroupRepository();
