import path from "path";
import winston from "winston";

import config from "../cfg";
import logWrapper from "./logWrapper";

function formatter({ timestamp, level, label, message }) {
    return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`.trim();
}

export function createLogger(name) {
    return logWrapper(
        winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.label({ label: name }),
                winston.format.printf(formatter)
            ),
            transports: [
                new winston.transports.File({
                    filename: path.join(config.logDirectory, kebabCase(name)),
                    maxsize: 1024 * 1024 * 10,
                }),
                new winston.transports.Console(),
            ],
        }),
        true
    );
}
