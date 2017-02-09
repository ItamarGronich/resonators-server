import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {followers, users, leaders} from '../sequelize/models';
import Follower from '../../domain/entities/follower';

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

        const foundFollowers = user.leader.followers.map(r => new Follower({
            id: r.get('id'),
            user_id: r.get('user_id'),
            leader_id: r.get('leader_id'),
            clinic_id: r.get('clinic_id'),
            status: r.get('status'),
            created_at: r.get('created_at'),
            updated_at: r.get('updated_at')
        }));

        foundFollowers.forEach(follower => this.trackEntity(follower));

        return foundFollowers;
    }
}

export default new FollowerRepository();
