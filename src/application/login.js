import {user_logins as UserLogin} from '../db/sequelize/models';
import { v4 as uuid } from "uuid";
import userRepository from '../db/repositories/UserRepository.js';
import * as dtoFactory from './dto/index.js'

export default async function login(email, pass) {
    const user = await userRepository.findByEmail(email);

    if (user) {
        return await authenticate(user, pass);
    } else {
        return {
            isValid: false,
            user: null
        };
    }
}

export async function loginByUserEntity(userEntity) {
    const loginId = uuid();

    await UserLogin.create({
        id: loginId,
        user_id: userEntity.id
    });

    const user = dtoFactory.toUser(userEntity);

    return {user, isValid: true, loginId};
}

async function authenticate(userEntity, pass) {
    let user = null, isValid = false, loginId;

    isValid = userEntity.passwordsMatch(pass);

    if (isValid) {
        ({user, isValid, loginId} = await loginByUserEntity(userEntity));
    }

    return {user, isValid, loginId};
}
