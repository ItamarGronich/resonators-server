import google from 'googleapis';
import cfg from '../cfg';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  cfg.google.clientId,
  cfg.google.secret,
  cfg.google.oauthRedirectUrl
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

export function generateAuthUrl({userId, isFirstTime}) {
    return oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',

      // If you only need one scope you can pass it as a string
      scope: scopes,

      // Optional property that passes state parameters to redirect URI
      state: JSON.stringify({ userId })
    });
}

export function requestAccessToken(code) {
    return new Promise((resolve, reject) => {
        oauth2Client.getToken(code, (err, tokens) => {
            if (err)
                return reject(err);

            // huh?
            // oauth2Client.setCredentials(tokens);

            resolve(tokens);
        });
    });
}
