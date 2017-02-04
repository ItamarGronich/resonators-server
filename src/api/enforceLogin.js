import relogin from '../application/relogin';

export default async function enforceLogin(request, response) {
    const {loginId} = request.cookies;

    if (!loginId) {
        sendLoginFailed(response);
        return;
    }

    const {isValid, user} = await relogin(loginId);

    if (!isValid)
        return sendLoginFailed(response);
    else
        return user;
}

function sendLoginFailed(response) {
    response.status(403);

    response.json({
        status: 'Must be logged in for using this call.'
    });
}
