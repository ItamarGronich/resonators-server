export default function routeHandler(cb) {
    return async function (req, res, ...rest) {
        try {
            return await cb(req, res, ...rest);
        } catch (err) {
            console.error('failed', err);
            res.status(500).send('Internal error');
        }
    }
}
