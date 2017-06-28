import uuid from 'uuid/v4';

export default function fetchBasicDetails(tokens) {
    return Promise.resolve({
        email: `${randStr('foo')}@bar.baz`,
        name: 'foo bar'
    });
}

function randStr(str) {
    const uuidSuffix = uuid().substring(0,8);
    return `${str}_${uuidSuffix}`;
}
