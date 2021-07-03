import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {followers, users, leaders, follower_group_followers, resonators} from '../sequelize/models';

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
                        required: true,
                    }, {
                        model: follower_group_followers,
                    }, {
                        model: resonators
                    }],
                    where: {is_system: false}
                }]
            }],
        });

        if (!_.get(user, 'leader.followers'))
            return [];

        const foundFollowers = user.leader.followers.map((follower) => {
            let stndaln = false;
            if (follower.follower_group_followers.length > 0 && follower.resonators.find(r => r.parent_resonator_id === null && r.follower_group_id === null)) {
                stndaln = true;
            }
            return dbToDomain.toFollower(follower, stndaln)
        });

        foundFollowers.forEach(follower => this.trackEntity(follower));

        return foundFollowers;
    }

    async findSystemFollowers() {
        const systemFollowers = await followers.findAll({
            where: {is_system: true},
            include: [{
                model: users,
                required: true
            }]
        });

        return systemFollowers.map(dbToDomain.toFollower);
    }

    async findByUserEmail(email, leader_userId) {
        const follower = await followers.findOne({
           where: {is_system: false},
           include: [
               {
                   model: users,
                   required: true,
                   where: {email}
               },
               {
                   model: leaders,
                   required: true,
                   where: {user_id: leader_userId}
               }
           ]
        });

        if (!follower) return null;

        return dbToDomain.toFollower(follower);
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
