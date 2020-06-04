import _ from 'lodash';
import google from 'googleapis';
import dispatch from './dispatcher';

const people = google.people('v1');

export default async function fetchBasicDetails(tokens) {
    const result = await dispatch(people.people.get, tokens, {
        resourceName: 'people/me',
        personFields: 'emailAddresses,names',
    });

    return {
        name: _.get(result, 'names[0].displayName'),
        email: _.get(result, 'emailAddresses[0].value')
    }
}
