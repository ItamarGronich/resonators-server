import promisify from './promisify';
import createOauthClient from './createOauthClient';

export default function dispatchGoogleApiCall(fn, tokens, params, options) {
    const oauth2Client = createOauthClient();
    oauth2Client.setCredentials(tokens);

    params = {
        auth: oauth2Client,
        ...params
    };

    return promisify(fn, params, options);
}
