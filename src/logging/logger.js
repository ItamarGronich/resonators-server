import path from "path";
import winston from "winston";

import config from "../cfg";
import logWrapper from "./logWrapper";

function formatter({ timestamp, level, message }) {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`.trim();
}

export function createLogger(filename) {
    return logWrapper(
        winston.createLogger({
            format: winston.format.combine(winston.format.timestamp(), winston.format.printf(formatter)),
            transports: [
                new winston.transports.File({
                    filename: path.join(config.logDirectory, filename),
                    maxsize: 1024 * 1024 * 10,
                }),
                new winston.transports.Console(),
            ],
        }),
        true
    );
}
