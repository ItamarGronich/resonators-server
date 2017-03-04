import _ from 'lodash';
import {assert} from 'chai';
import moment from 'moment';

export default function assertLoginResponse(response, expectedResult) {
    assert.equal(response.status, 200);

    assert.deepEqual(_.omit(response.body, 'expires_at'), {
        email: expectedResult.email,
        name: expectedResult.name,
        country: null,
        unsubscribed: null
    });

    assert(moment(response.body.expires_at) > moment(),
           `expires_at (${response.body.expires_at}) must be in the future.`);

    assert.match(response.headers['set-cookie'][0],
                 /loginId=.+; Max\-Age=\d+;/,
                 'set cookie match failed');
}