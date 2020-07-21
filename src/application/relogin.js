import { user_logins as UserLogin, users, leaders, followers } from '../db/sequelize/models';
import { toUser, toLeader, toFollower } from '../db/dbToDomain';

export default async function relogin(loginId) {
    const row = await UserLogin.findOne({
        where: {
            id: loginId
        },
        include: [{
            model: users,
            include: [leaders, followers]
        }]
    });

    if (row) {
        const { user } = row;
        const userEntity = toUser(user);
        const leaderEntity = user.leader && toLeader(user.leader);
        const followerEntity = user.follower && toFollower(user.follower);

        return {
            isValid: Boolean(row.get('id')),
            user: userEntity,
            leader: leaderEntity,
            follower: followerEntity
        };
    } else {
        return {
            isValid: false,
            user: null
        };
    }
}
