import path from "path";
import winston from "winston";
import { kebabCase } from "lodash";

import config from "../cfg";
import formatLog from "./format";

const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";

export function createLogger(name) {
    const logger = winston.createLogger({
        level: "debug",
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.metadata(),
            winston.format.label({ label: name }),
            winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
            winston.format.printf(formatLog)
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
