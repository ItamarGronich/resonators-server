import setLoginCookie from './setLoginCookie';

export default function setSuccessfulLoginResponse({
    response,
    loginId,
    user
}) {
    response.status(200);

    const {expires_at} = setLoginCookie({response, loginId});

    response.json({...user, id: loginId, expires_at, auth_token: loginId});
}
