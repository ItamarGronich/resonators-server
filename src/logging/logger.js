import path from "path";
import winston from "winston";
import { kebabCase, isEmpty } from "lodash";

import config from "../cfg";
import logWrapper from "./logWrapper";

function formatMetadata(metadata) {
    return isEmpty(metadata)
        ? ""
        : Object.entries(metadata)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n");
}

function formatter({ timestamp, level, label, message, metadata }) {
    return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}\n${formatMetadata(metadata)}`.trim();
}

export function createLogger(name) {
    return logWrapper(
        winston.createLogger({
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.metadata(),
                winston.format.timestamp(),
                winston.format.label({ label: name }),
                winston.format.printf(formatter)
            ),
            transports: [
                new winston.transports.File({
                    filename: path.join(config.logging.directory, kebabCase(name), kebabCase(name)),
                    maxsize: config.logging.maxFileSize,
                    maxFiles: config.logging.maxFiles,
                    tailable: true,
                }),
                new winston.transports.Console(),
            ],
        }),
        true
    );
}
