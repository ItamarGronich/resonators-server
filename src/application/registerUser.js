import getUow from './getUow';
import User from '../domain/entities/user';
import Leader from '../domain/entities/leader';
import Clinic from '../domain/entities/clinic';
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

    const leader = new Leader({
        id: uuid(),
        user_id: user.id,
        title: user.name,
        visible: 1
    });

    const clinic = new Clinic({
        id: uuid(),
        user_id: user.id,
        name: `${name}'s clinic'`
    });

    if (user.error)
        return user;

    const uow = await getUow();

    uow.trackEntity(user, {isNew: true});
    uow.trackEntity(leader, {isNew: true});
    uow.trackEntity(clinic, {isNew: true});

    await uow.commit();

    const loginResult = await login(email, password);

    return loginResult;
}
