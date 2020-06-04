import cfg from '../cfg';
import google from 'googleapis';

const OAuth2 = google.auth.OAuth2;

export default function createOauthClient(oauthRedirectUrl) {
    return new OAuth2(
        cfg.google.clientId,
        cfg.google.secret,
        oauthRedirectUrl
    );
}
