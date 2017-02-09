import {user_logins as UserLogin, users, leaders} from '../db/sequelize/models';
import {toUser} from './dto';

export default async function relogin(loginId) {
    const row = await UserLogin.findOne({
        where: {
            id: loginId
        },
        include: [{
            model: users,
            include: [leaders]
        }]
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
