import User from '../db/dbModels/user';
import UserLogin from '../db/dbModels/userLogin';
import uuid from 'uuid/v4';
import userRepository from '../db/repositories/UserRepository.js';
import * as dtoFactory from './dto/index.js'

export default async function login(email, pass) {
    const user = await userRepository.findByEmail(email);

    if (user) {
        const result = await authenticate(user, pass);
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
