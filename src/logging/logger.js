import { EOL } from "os";
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
                  .join(EOL),
              INDENTATION
          );
}

function formatter({ timestamp, level, label, message, stack, metadata }) {
    const logMessage = `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
    return [logMessage, stack, formatMetadata(metadata)].filter(Boolean).join(EOL).trim();
}

export function createLogger(name) {
    const logger = winston.createLogger({
        level: "debug",
        format: winston.format.combine(
            winston.format.metadata(),
            winston.format.errors({ stack: true }),
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
