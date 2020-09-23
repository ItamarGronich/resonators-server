import {user_password_resets} from '../db/sequelize/models';

export default async function resetPasswordTokenValidator(token) {
    const row = await user_password_resets.findByPk(token);
    return !!row;
}
