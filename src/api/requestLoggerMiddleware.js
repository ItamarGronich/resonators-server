import log from '../infra/log';

export default function requestLoggerMiddleware(req, res, next) {
    const reqMsg = {
        type: 'request',
        method: req.method,
        url: req.path
    };

    if (req.method === 'post')
        msg.body = req.body;

    log.info(reqMsg);

    res.on('finish', () => {
        const resMsg = {
            type: 'response',
            statusCode: res.statusCode
        };

        log.info(resMsg);
    });

    next();
}
