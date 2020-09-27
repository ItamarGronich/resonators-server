import path from "path";
import winston from "winston";

import logWrapper from "./logWrapper";

function formatter({ timestamp, level, message }) {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`.trim();
}

export function createLogger(fileName) {
    return logWrapper(
        winston.createLogger({
            format: winston.format.combine(winston.format.timestamp(), winston.format.printf(formatter)),
            transports: [
                new winston.transports.File({
                    filename: path.join(__dirname, `../../logs/${fileName}`),
                    maxsize: 1024 * 1024 * 10,
                }),
                new winston.transports.Console(),
            ],
        }),
        true
    );
}
