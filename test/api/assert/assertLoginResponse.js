import _ from 'lodash';
import {assert} from 'chai';
import moment from 'moment';

export default function assertLoginResponse(response, expectedResult) {
    assert.equal(response.status, 200);

    assert.deepEqual(_.omit(response.body, 'id', 'expires_at', 'auth_token'), {
        email: expectedResult.email,
        name: expectedResult.name,
        country: null,
        unsubscribed: null
    });

    assert.isOk(response.body.id);
    assert.isOk(response.body.auth_token);

    assert(moment(response.body.expires_at) > moment(),
           `expires_at (${response.body.expires_at}) must be in the future.`);

    assertLoginCookie(response);
}

export function assertLoginCookie(response) {
    assert.match(response.headers['set-cookie'][0],
                 /loginId=.+; Max\-Age=\d+;/,
                 'set cookie match failed');
}
