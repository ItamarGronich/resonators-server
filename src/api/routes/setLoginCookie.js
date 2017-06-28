import moment from 'moment';

const maxAge = 3600 * 24 * 7 * 1000;

export default function setLoginCookie({
    response,
    loginId
}) {
    const expires_at = moment().add(maxAge, 's').format();

    response.cookie('loginId', loginId, {
        maxAge
    });

    return {expires_at, maxAge};
}
