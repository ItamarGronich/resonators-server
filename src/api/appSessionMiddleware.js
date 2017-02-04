export default function uowMiddleware(req, res, next) {
    req.appSession = {};

    return next();
};
