import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {followers, users, leaders} from '../sequelize/models';

class FollowerRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(follower) {
        return {
            ...follower
        };
    }

    async findByLeaderUserId(leaderUserId) {
        const user = await users.findOne({
            id: leaderUserId,

            include: [{
                model: leaders,
                include: [{
                    model: followers,
                    include: [users]
                }]
            }]
        });

        if (!_.get(user, 'leader.followers'))
            return [];

        const foundFollowers = user.leader.followers.map(dbToDomain.toFollower);

        foundFollowers.forEach(follower => this.trackEntity(follower));

        return foundFollowers;
    }

    async findById(id) {
        const row = await followers.findOne({ id });

        if (!row)
            return null;

        const follower = dbToDomain.toFollower(row);

        this.trackEntity(follower);

        return follower;
    }
}

export default new FollowerRepository();
