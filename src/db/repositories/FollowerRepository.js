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

    save(follower, transaction) {
        return followers.upsert(follower, {transaction});
    }

    async findByLeaderUserId(leaderUserId) {
        const user = await users.findOne({
            where: {id: leaderUserId},

            include: [{
                model: leaders,
                include: [{
                    model: followers,
                    include: [{
                        model: users,
                        required: true
                    }]
                }]
            }]
        });

        if (!_.get(user, 'leader.followers'))
            return [];

        const foundFollowers = user.leader.followers.map(dbToDomain.toFollower);

        foundFollowers.forEach(follower => this.trackEntity(follower));

        return foundFollowers;
    }

    async findByPk(id) {
        const row = await followers.findByPk(id);

        if (!row)
            return null;

        const follower = dbToDomain.toFollower(row);

        this.trackEntity(follower);

        return follower;
    }

    async deleteById(id) {
        return await followers.destroy({
            where: {
                id
            }
        });
    }
}

export default new FollowerRepository();
