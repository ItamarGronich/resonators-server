import createOauthClient from './createOauthClient';

const leaderScopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/contacts.other.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/calendar'
];
const followerScopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
];

export function generateAuthUrl(redirectUrl, state = {isLeader: false}) {
    const oauth2Client = createOauthClient(redirectUrl);

    return oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope you can pass it as a string
        scope: state.isLeader ? leaderScopes : followerScopes,

        // Optional property that passes state parameters to redirect URI
        state: JSON.stringify(state)
    });
}

export function requestAccessToken(redirectUrl, code) {
    return new Promise((resolve, reject) => {
        const oauth2Client = createOauthClient(redirectUrl);

        oauth2Client.getToken(code, (err, tokens) => {
            if (err)
                return reject(err);

            // huh?
            // oauth2Client.setCredentials(tokens);

            resolve(tokens);
        });
    });
}
