import _ from 'lodash';
import google from 'googleapis';
import createOauthClient from './createOauthClient';

const plus = google.plus('v1');

export default function fetchBasicDetails({access_token, refresh_token, expiry_date}) {
    const oauth2Client = createOauthClient();

    // Retrieve tokens via token exchange explained above or set them:
    oauth2Client.setCredentials({
        access_token,
        refresh_token,
        expiry_date
    });

    return new Promise((resolve, reject) => {
        plus.people.get({
            userId: 'me',
            auth: oauth2Client
        }, function (err, response) {
            if (err) {
                return reject(err);
            }

            resolve({
                name: _.get(response, 'displayName'),
                email: _.get(response, 'emails[0].value')
            });
        });
    });
}
