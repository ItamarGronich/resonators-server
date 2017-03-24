import {user_logins} from '../db/sequelize/models';

export default async function logout(loginId) {
    return await user_logins.destroy({
        where: {
            id: loginId
        }
    });
}
