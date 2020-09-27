import {user_logins as UserLogin} from '../db/sequelize/models';
import { v4 as uuid } from "uuid";
import userRepository from '../db/repositories/UserRepository.js';
import leaderRepository from '../db/repositories/leaderRepository.js';
import * as dtoFactory from './dto/index.js'
import getUow from './getUow';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import secrets from '../cfg/secrets';

export default async function login(email, pass) {
    const user = await userRepository.findByEmail(email);

    if (user) {
        await checkLeaderGroupPermissions(user);
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

async function checkLeaderGroupPermissions(user) {
    const uow = getUow();

    const leader = await leaderRepository.findByUserId(user.id)
    if (!leader)
        return;

    const doc = new GoogleSpreadsheet(secrets.permissionsSheet.sheetId);

    await doc.useServiceAccountAuth(secrets.serviceAccount);

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const sheetLeader = rows.find(({Email}) => Email && Email.toLowerCase() === user.email.toLowerCase())
    const permission = Boolean(sheetLeader) && sheetLeader.Groups.toLowerCase() === 'true';
    leader.group_permissions = permission;
    await uow.commit();
}
