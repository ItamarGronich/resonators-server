import {user_logins as UserLogin, users, leaders} from '../db/sequelize/models';
import {toUser, toLeader} from '../db/dbToDomain';

export default async function relogin(loginId) {
    const row = await UserLogin.findOne({
        where: {
            id: loginId
        },
        include: [{
            model: users,
            include: [leaders]
        }]
    });

    if (row) {
        const {user} = row;
        const userEntity = toUser(user);
        const leaderEntity = user.leader && toLeader(user.leader);

        return {
            isValid: Boolean(row.get('id')),
            user: userEntity,
            leader: leaderEntity
        };
    } else {
        return {
            isValid: false,
            user: null
        };
    }
}
