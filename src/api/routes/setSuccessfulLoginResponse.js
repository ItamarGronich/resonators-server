import setLoginCookie from "./setLoginCookie";
import { followers, leaders } from "../../db/sequelize/models";

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
    isLeader: await isOfType(leaders, user),
    isFollower: await isOfType(followers, user),
});

const isOfType = async (model, user) => (await model.count({ where: { user_id: user.id } })) === 1;
