import path from "path";
import winston from "winston";
import indent from "indent-string";
import { kebabCase, isEmpty } from "lodash";

import config from "../cfg";

const INDENTATION = 2;
const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";

function formatMetadata(metadata) {
    return isEmpty(metadata)
        ? ""
        : indent(
              Object.entries(metadata)
                  .map(([key, value]) => `${key}: ${JSON.stringify(value, null, INDENTATION)}`)
                  .join("\n"),
              INDENTATION
          );
}

function formatter({ timestamp, level, label, message, metadata }) {
    return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}\n${formatMetadata(metadata)}`.trim();
}

export function createLogger(name) {
    const logger = winston.createLogger({
        level: "http",
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.metadata(),
            winston.format.label({ label: name }),
            winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
            winston.format.printf(formatter)
        ),
        transports: [
            new winston.transports.File({
                filename: path.join(config.logging.directory, kebabCase(name), kebabCase(name)),
                maxsize: config.logging.maxFileSize,
                maxFiles: config.logging.maxFiles,
                tailable: true,
            }),
        ],
    });

    if (process.env.ENV !== "production") {
        logger.add(new winston.transports.Console());
    }

    return logger;
}
