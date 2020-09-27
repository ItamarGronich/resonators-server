import path from "path";
import winston from "winston";
import { kebabCase } from "lodash";

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
                    filename: path.join(config.logging.directory, kebabCase(name), kebabCase(name)),
                    maxsize: config.logging.maxFileSize,
                    maxFiles: config.logging.maxFiles,
                }),
                new winston.transports.Console(),
            ],
        }),
        true
    );
}
