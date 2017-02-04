import {user_logins as UserLogin, users} from '../db/sequelize/models';
import {toUser} from './dto';

export default async function relogin(loginId) {
    const row = await UserLogin.findOne({
        where: {
            id: loginId
        },
        include: [users]
    });

    if (row) {
        const {user} = row;
        const userDto = toUser(user);

        return {
            isValid: Boolean(row.get('id')),
            user: userDto
        };
    } else {
        return {
            isValid: false,
            user: null
        };
    }
}
