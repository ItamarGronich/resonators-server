import getUow from './getUow';
import User from '../domain/entities/user';
import Leader from '../domain/entities/leader';
import Clinic from '../domain/entities/clinic';
import LeaderClinic from '../domain/entities/leaderClinic';
import userRepository from '../db/repositories/UserRepository';
import { v4 as uuid } from "uuid";
import login from './login';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import secrets from '../cfg/secrets';


export async function registerUser({name, email, password}) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser)
        return {
            error: 'email is already registered'
        };

    const user = new User({ name, email, pass: password });



    const clinic = new Clinic({
        id: uuid(),
        user_id: user.id,
        name: `${name}'s clinic`
    });

    const leader = new Leader({
        id: uuid(),
        user_id: user.id,
        title: user.name,
        current_clinic_id: clinic.id,
        group_permissions: await getLeaderGroupPermissions(email),
        visible: 1
    });

    var leaderClinic = new LeaderClinic({
        id: uuid(),
        leader_id : leader.id,
        clinic_id : clinic.id,
        is_primary : true,
        is_leader_accepted: false
    });
    
    if (user.error)
        return user;

    const uow = getUow();

    uow.trackEntity(user, {isNew: true});
    uow.trackEntity(leader, {isNew: true});
    uow.trackEntity(clinic, {isNew: true});
    uow.trackEntity(leaderClinic, {isNew: true});
    await uow.commit();

    const loginResult = await login(email, password);

    return {...loginResult, user_id: user.id};
}

async function getLeaderGroupPermissions(leaderEmail) {
    const doc = new GoogleSpreadsheet('1tzrGmIQbxTtB7rgLCNziNATsfBsZ5rJIuX-2hSmNRKo');

    await doc.useServiceAccountAuth(secrets.serviceAccount);

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const leader = rows.find(({Email}) => Email === leaderEmail)
    return Boolean(leader) && leader.Groups.toLowerCase() === 'true';
}
