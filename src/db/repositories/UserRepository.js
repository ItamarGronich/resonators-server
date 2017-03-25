import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {users as User, followers, user_password_resets} from '../sequelize/models';

class UserRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(user) {
        return {
            ...user
        };
    }

    async save(user, transaction) {
        return User.upsert(user, {transaction});
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

    async findByResetPasswordToken(token) {
        const row = await User.findOne({
            include: [{
                model: user_password_resets,
                where: {
                    id: token
                }
            }]
        });

        const user = dbToDomain.toUser(row);
        this.trackEntity(user);
        return user;
    }
}

export default new UserRepository();
