import uuid from 'uuid/v4';

export function generateAuthUrl({userId}) {
    const state = encodeURIComponent(JSON.stringify({
        state: {
            userId
        }
    }));

    return `https://accounts.google.com?state=${state}&redirecUri=%2FconfirmGoogleAuth`;
}

export function requestAccessToken() {
    return Promise.resolve({
        access_token: uuid(),
        refresh_token: uuid(),
        id_token: uuid(),
        token_type: 'Bearer',
        expiry_date: 3738851787
    });
}
