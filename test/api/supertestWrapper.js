import request from 'supertest';

let _request;

export default function supertestWrapper({ url, method, body, cookie }) {
    if (!_request)
        throw new Error('need to init supertest with the express app before using it!');

    return new Promise((resolve, reject) => {
        const req = _request[method].call(_request, url);

        if (cookie)
            req.set('Cookie', cookie);

        if (body)
            req.send(body);

        req.expect(resolve)
           .catch(reject);
    });
}

export function init(app) {
    _request = request(app);
}
