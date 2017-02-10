import relogin from '../application/relogin';

export default async function enforceLogin(request, response) {
    const {loginId} = request.cookies;

    if (!loginId) {
        sendLoginFailed(response);
        return;
    }

    const reloginResult = await relogin(loginId);

    if (!reloginResult.isValid)
        return sendLoginFailed(response);
    else
        return reloginResult;
}

function sendLoginFailed(response) {
    response.status(403);

    response.json({
        status: 'Must be logged in for using this call.'
    });
}
