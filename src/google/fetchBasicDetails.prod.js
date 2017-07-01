import _ from 'lodash';
import google from 'googleapis';
import dispatch from './dispatcher';

const plus = google.plus('v1');

export default async function fetchBasicDetails(tokens) {
    const result = await dispatch(plus.people.get, tokens, {
        userId: 'me'
    });

    return {
        name: _.get(result, 'displayName'),
        email: _.get(result, 'emails[0].value')
    };
}
