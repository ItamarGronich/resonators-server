import relogin from '../../application/relogin';

export default async function enforceLogin(request, response) {
    let loginId = request.cookies.loginId || request.headers.authorization;

    if (!loginId) {
        sendLoginFailed(response);
        return;
    }

    const reloginResult = await relogin(loginId);

    let result;

    if (reloginResult.isValid)
        result = reloginResult;
    else
        sendLoginFailed(response);

    request.appSession = result;
    return result;
}

function sendLoginFailed(response) {
    response.status(403);

    response.json({
        status: 'Must be logged in for using this call.'
    });
}
