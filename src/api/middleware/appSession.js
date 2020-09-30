export default function (req, res, next) {
    req.appSession = {};
    return next();
}
