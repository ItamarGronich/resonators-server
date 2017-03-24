import moment from 'moment';

const maxAge = 3600 * 24 * 7 * 1000;

export default function setSuccessfulLoginResponse({
    response,
    loginId,
    user
}) {
    response.status(200);

    const expires_at = moment().add(maxAge, 's').format();

    response.cookie('loginId', loginId, {
        maxAge
    });

    response.json({...user, id: loginId, expires_at, auth_token: loginId});
}
