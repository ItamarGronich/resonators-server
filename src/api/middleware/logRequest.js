import { isEmpty } from "lodash";

import { apiLogger as logger } from "../../logging";

export default function (req, res, next) {
    logRequest(req);
    res.on("finish", () => logResponse(req, res));
    next();
}

function logRequest(request) {
    logger.http(`${request.method} ${request.path}`, {
        id: request.id,
        client: getClient(request),
        ...(isEmpty(request.body) || { body: request.body }),
    });
}

function logResponse(request, response) {
    logger.http(`${response.statusCode} ${request.path}`, {
        request: request.id,
    });
}

function getClient(request) {
    const ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
    const userAgent = request.useragent.source;
    return `${ip} ${userAgent}`;
}
