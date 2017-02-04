import relogin from '../application/relogin';

export default async function enforceLogin(request, response) {
    const {loginId} = request.cookies;

    if (!loginId) {
        response.status(403);

        response.json({
            status: 'Must be logged in for using this call.'
        });

        return;
    }

    const {isValid, user} = await relogin(loginId);
    return user;
}
