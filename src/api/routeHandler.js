import enforcePermissionPolicy from './permissions';

export default function routeHandler(cb, options) {
    options = {enforceLogin: true, ...options};

    return async function (req, res, ...rest) {
        try {
            if (!await enforcePermissionPolicy(req, res, options))
                return;

            return await cb(req, res, ...rest);
        } catch (err) {
            console.error('failed', err);
            res.status(500).send('Internal error');
        }
    }
}
