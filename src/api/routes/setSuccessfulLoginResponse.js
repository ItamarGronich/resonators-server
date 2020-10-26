import setLoginCookie from "./setLoginCookie";
import { followers, leaders } from "../../db/sequelize/models";
import { hasRelation } from '../../application/utils';

export default async function setSuccessfulLoginResponse({ response, loginId, user }) {
    const { expires_at } = setLoginCookie({ response, loginId });

    response.status(200).json({
        ...(await addUserTypes(user)),
        id: loginId,
        expires_at,
        auth_token: loginId,
    });
}

const addUserTypes = async (user) => ({
    ...user,
    isLeader: await hasRelation(leaders, user, 'user_id'),
    isFollower: await hasRelation(followers, user, 'user_id'),
});
