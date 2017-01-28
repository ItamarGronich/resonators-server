import * as dbToDomain from './converters/dbToDomain';
import User from '../dbModels/user';
import * as dtoFactory from './dto';

export default async function login(email, pass) {
    const dbUser = await User.findOne({
        where: {
            email
        }
    });

    let user, isValid;

    if (dbUser) {
        const userEntity = dbToDomain.toUser(dbUser);
        user = dtoFactory.toUser(userEntity);
        isValid = userEntity.passwordsMatch(pass);
    }

    return {
        isValid,
        user: isValid && user
    };
}
