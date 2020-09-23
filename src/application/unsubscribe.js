import userRepository from '../db/repositories/UserRepository';
import getUow from './getUow';

export async function unsubscribe(user_id) {
    const user = await userRepository.findByPk(user_id);

    if (user) {
        user.unsubscribe();
        await getUow().commit();
        return true;
    }

    return false;
}

export async function resubscribe(user_id) {
    const user = await userRepository.findByPk(user_id);

    if (user) {
        user.resubscribe();
        await getUow().commit();
        return true;
    }

    return false;
}
