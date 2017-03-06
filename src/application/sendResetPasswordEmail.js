import sendEmail from '../emailScheduler/sendResonatorEmail';
import userRepository from '../db/repositories/UserRepository';
import {user_password_resets} from '../db/sequelize/models';
import cfg from '../cfg';
import uuid from 'uuid/v4';

export default async function sendResetPasswordEmail(email) {
    const user = await userRepository.findByEmail(email);

    if (!user)
        return {
            error: 'email does not exist.'
        };

    const token = uuid();

    await user_password_resets.create({
        id: token,
        user_id: user.id
    });

    await sendEmail({
        to: email,
        subject: 'Password Reset to the Resonators system',
        html: `Please click <a href='${cfg.host}resetPassword?token=${token}'>here</a> to reset your password to the Resonators system.`
    });

    return {};
}
