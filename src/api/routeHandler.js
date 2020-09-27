import enforcePermissionPolicy from './permissions';
import log from '../logging';

export default function routeHandler(cb, options) {
    options = {enforceLogin: true, ...options};

    return async (req, res, ...rest) => {
        try {
            if (!await enforcePermissionPolicy(req, res, options))
                return;

            return await cb(req, res, ...rest);
        } catch (err) {
            log.error(`Failed: ${JSON.stringify(err.stack, null, 2)}`);
            res.status(500).send('Internal error');
        }
    }
}
