import enforceLogin from './enforceLogin';

export default function routeHandler(cb, options = {}) {
    return async function (req, res, ...rest) {
        try {
            if (options.enforceLogin) {
                const loggedInUser = await enforceLogin(req, res);

                req.appSession.user = loggedInUser;

                if (!loggedInUser) {
                    return;
                }
            }

            return await cb(req, res, ...rest);
        } catch (err) {
            console.error('failed', err);
            res.status(500).send('Internal error');
        }
    }
}
