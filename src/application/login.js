import { v4 as uuid } from "uuid";

import log from "../logging";
import * as dtoFactory from "./dto/index.js";
import userRepository from "../db/repositories/UserRepository.js";
import { user_logins as UserLogin, followers, leaders } from "../db/sequelize/models";
import { checkLeaderGroupPermissions } from "./leaderFollowerGroups";

export default async function login(email, pass, isLeader) {
    const user = await userRepository.findByEmail(email);

    if (user) {
        if (isLeader) {
            if (!await isOfType(leaders, user)) {
                return {
                    isValid: false,
                    user: null
                }
            }
        } else {
            if (!await isOfType(followers, user)) {
                return {
                    isValid: false,
                    user: null
                }
            }
        }
        try {
            await checkLeaderGroupPermissions(user);
        } catch (e) {
            log.error(`Could not verify leader's permissions`, e);
        }
        return await authenticate(user, pass);
    } else {
        return {
            isValid: false,
            user: null,
        };
    }
}

export async function loginByUserEntity(userEntity) {
    const loginId = uuid();

    await UserLogin.create({
        id: loginId,
        user_id: userEntity.id,
    });

    const user = dtoFactory.toUser(userEntity);

    return { user, isValid: true, loginId };
}

async function authenticate(userEntity, pass) {
    let user = null,
        isValid = false,
        loginId;

    isValid = userEntity.passwordsMatch(pass);

    if (isValid) {
        ({ user, isValid, loginId } = await loginByUserEntity(userEntity));
    }

    return { user, isValid, loginId };
}

const isOfType = async (model, user) => (await model.count({ where: { user_id: user.id } })) === 1;