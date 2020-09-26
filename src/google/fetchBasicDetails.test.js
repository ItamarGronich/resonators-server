import { v4 as uuid } from "uuid";

export default function fetchBasicDetails() {
    return Promise.resolve({
        email: `${randStr('foo')}@bar.baz`,
        name: 'foo bar'
    });
}

function randStr(str) {
    const uuidSuffix = uuid().substring(0,8);
    return `${str}_${uuidSuffix}`;
}
