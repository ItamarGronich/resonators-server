import {user_logins as UserLogin} from '../db/sequelize/models';
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
            user_id: userEntity.id
        });

        user = dtoFactory.toUser(userEntity);
    }

    return {user, isValid};
}
