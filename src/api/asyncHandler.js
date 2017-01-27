export default function routeHandler(cb) {
    return function(req, res, ...rest) {
        try {
            return cb(req, res, ...next);
        } catch (err) {
            console.error('error', err);
            res.status(500).send('Something broke!');
        }
    };
}
