import * as dbToDomain from './dbToDomain';
import Repository from './Repository';
import User from './user';

class UserRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(user) {
        return {
            ...user
        };
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
}

export default new UserRepository();
