import * as dbToDomain from './converters/dbToDomain';
import User from '../dbModels/user';
import UserLogin from '../dbModels/userLogin';
import uuid from 'uuid/v4';
import * as dtoFactory from './dto';

export default async function login(email, pass) {
    const dbUser = await User.findOne({
        where: {
            email
        }
    });

    if (dbUser) {
        const userEntity = dbToDomain.toUser(dbUser);
        const result = await authenticate(userEntity, pass);
        return result;
    } else {
        return {
            isValid: false,
            user: null
        };
    }
}

async function authenticate(userEntity, pass) {
    let user = null, isValid = false;

    isValid = userEntity.passwordsMatch(pass);

    if (isValid) {
        await UserLogin.create({
            id: uuid(),
            userId: userEntity.id
        });

        user = dtoFactory.toUser(userEntity);
    }

    return {user, isValid};
}
