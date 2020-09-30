import path from "path";
import winston from "winston";
import { kebabCase } from "lodash";

import config from "../cfg";
import formatLog from "./formatting";

/**
 * Creates a new logger instance to be used by a component of the system.
 *
 * @param {String} name - the name of the logger.
 *                        This will be used for labeling log messages and naming log files.
 */
export function createLogger(name) {
    const logger = winston.createLogger({
        level: "debug",
        format: winston.format.combine(
            winston.format.errors({ stack: true }), // extract error stacks from error objects
            winston.format.metadata(), // support extra details appended to logs (useful for debugging)
            winston.format.label({ label: name }), // label log messages by their name
            winston.format.timestamp({ format: config.logging.timestampFormat }), // add log timestamps
            winston.format.printf(formatLog) // finalize and format into a string
        ),
        transports: [
            new winston.transports.File({
                // separating logs from different loggers to separate sub-directories
                filename: path.join(config.logging.directory, kebabCase(name), kebabCase(name)),
                maxsize: config.logging.maxFileSize,
                maxFiles: config.logging.maxFiles,
                tailable: true,
            }),
        ],
    });

    // We don't need console logging in production since nobody is looking at it...
    if (process.env.ENV !== "production") {
        logger.add(new winston.transports.Console());
    }

    return logger;
}
