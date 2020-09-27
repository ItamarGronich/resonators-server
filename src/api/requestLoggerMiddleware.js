import log from '../logging';

export default function requestLoggerMiddleware(req, res, next) {
    const method = req.method;
    const path = req.path;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ua = req.useragent.source;

    const reqMsg = {
        ip: ip,
        method: method,
        type: 'REQ',
        url: path,
        userAgent: ua
    };

    if (req.method === 'post')
        reqMsg.body = req.body;

    log.info(reqMsg);

    res.on('finish', () => {
        const resMsg = {
            ip: ip,
            method: method,
            type: 'RES',
            url: path,
            statusCode: res.statusCode,
            userAgent: ua
        };

        log.info(resMsg);
    });

    next();
}
