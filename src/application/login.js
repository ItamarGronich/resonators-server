import * as dbToDomain from './converters/dbToDomain';
import User from '../dbModels/user';

export default async function login(email, pass) {
    const dbUser = await User.findOne({
        where: {
            email
        }
    });

    let user, isValid;

    if (dbUser) {
        user = dbToDomain.toUser(dbUser);
        isValid = user.passwordsMatch(pass);
    }

    return {
        isValid,
        user: isValid && user
    };
}
