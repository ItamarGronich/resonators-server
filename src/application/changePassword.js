import resetPasswordTokenValidator from './resetPasswordTokenValidator';
import userRepository from '../db/repositories/UserRepository';
import getUow from './getUow';

export default async function changePassword(token, password) {
    const tokenValid = await resetPasswordTokenValidator(token);

    if (!tokenValid)
        return {
            error: 'invalid token'
        };

    const user = await userRepository.findByResetPasswordToken(token);

    user.changePassword(password);

    await getUow().commit();

    return {};
}
