import getUow from './getUow';
import User from '../domain/entities/user';
import Leader from '../domain/entities/leader';
import Clinic from '../domain/entities/clinic';
import LeaderClinic from '../domain/entities/leaderClinic';
import userRepository from '../db/repositories/UserRepository';
import uuid from 'uuid/v4';
import login from './login';

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
        group_permissions: true,
        visible: 1
    });

    var leaderClinic = new LeaderClinic({
        id: uuid(),
        leader_id : leader.id,
        clinic_id : clinic.id,
        isPrimary : true,
        isLeaderAccepted: false
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
