import { v4 as uuid } from "uuid";
import createOauthClient from './createOauthClient';

// generate a url that asks permissions for Google+ and Google Calendar scopes
const scopes = [
    'https://www.googleapis.com/auth/plus.me'
//    'https://www.googleapis.com/auth/calendar'
];

export function generateAuthUrl(state) {
    const oauth2Client = createOauthClient();

    return oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope you can pass it as a string
        scope: scopes,

        // Optional property that passes state parameters to redirect URI
        state: JSON.stringify(state)
    });
}

export function requestAccessToken() {
    return Promise.resolve({
        access_token: uuid(),
        refresh_token: 'refresh_token',
        id_token: uuid(),
        token_type: 'Bearer',
        expiry_date: 3738851787
    });
}
