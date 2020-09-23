import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {follower_groups, leaders} from '../sequelize/models';

class FollowerGroupRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(followerGroup) {
        return {
            ...followerGroup
        };
    }

    async save(followerGroup, transaction) {
        return await follower_groups.upsert(followerGroup, {transaction});
    }

    async findByLeaderId(leaderId) {
        const leader = await leaders.findOne({
            where: {id: leaderId},
            include: [{
                model: follower_groups,
            }]
        });
        if (!_.get(leader, 'follower_groups')) {
            return [];
        }

        const foundFollowerGroups = leader.follower_groups.map(dbToDomain.toFollowerGroup);
        foundFollowerGroups.forEach(followerGroup => this.trackEntity(followerGroup));

        return foundFollowerGroups;
    }

    async findByPk(id) {
        const row = await follower_groups.findByPk(id);

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
