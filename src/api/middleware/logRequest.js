import { apiLogger as logger } from "../../logging";

export default function (req, res, next) {
    logRequest(req);
    res.on("finish", () => logResponse(req, res));
    next();
}

function logRequest(request) {
    const logInfo = {
        type: "REQ",
        url: request.path,
        method: request.method,
        ip: getClientIp(request),
        userAgent: request.useragent.source,
    };

    if (request.method === "post") {
        logInfo.body = request.body;
    }

    logger.http(logInfo);
}

function logResponse(request, response) {
    const logInfo = {
        type: "RES",
        url: request.path,
        method: request.method,
        ip: getClientIp(request),
        statusCode: response.statusCode,
        userAgent: request.useragent.source,
    };

    logger.http(logInfo);
}

function getClientIp(request) {
    return request.headers["x-forwarded-for"] || request.connection.remoteAddress;
}
