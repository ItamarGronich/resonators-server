import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {users as User, followers} from '../sequelize/models';

class UserRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(user) {
        return {
            ...user
        };
    }

    async save(user, tran) {
        return User.upsert(user, tran);
    }

    async findByEmail(email) {
        const dbUser = await User.findOne({
            where: {
                email
            }
        });

        if (dbUser) {
            const user = dbToDomain.toUser(dbUser);
            this.trackEntity(user);
            return user;
        }

        return null;
    }

    async findByFollowerId(followerId) {
        const dbUser = await User.findOne({
            include: [{
                model: followers,
                where: {id: followerId}
            }]
        });

        if (!dbUser)
            return null;

        const user = dbToDomain.toUser(dbUser);
        this.trackEntity(user);
        return user;
    }
}

export default new UserRepository();
