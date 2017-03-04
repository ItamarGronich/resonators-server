import getUow from './getUow';
import User from '../domain/entities/user';
import userRepository from '../db/repositories/UserRepository';
import login from './login';

export async function registerUser({name, email, password}) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser)
        return {
            error: 'email is already registered'
        };

    const user = new User({ name, email, pass: password });

    if (user.error)
        return user;

    const uow = await getUow();

    uow.trackEntity(user, {isNew: true});

    await uow.commit();

    const loginResult = await login(email, password);

    return loginResult;
}
