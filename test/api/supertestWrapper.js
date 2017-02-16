import request from 'supertest';

export default function supertestWrapper({ app, url, method, body, cookie }) {
    return new Promise((resolve, reject) => {
        let req = request(app);

        req = req[method].call(req, url);

        if (cookie)
            req = req.set('Cookie', cookie);

        if (body)
            req = req.send(body);

        req.expect((body) => resolve(body))
           .catch(reject);
    });
}
