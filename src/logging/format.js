import { EOL } from "os";
import { isEmpty } from "lodash";
import indent from "indent-string";

/**
 * Formats the core part of a log message.
 */
function formatMessage({ timestamp, level, label, message }) {
    return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
}

/**
 * Serializes any metadata value in a readable fashion.
 */
function serialize(value) {
    return JSON.stringify(value, null, 4);
}

/**
 * Formats all extra meta-details attached to a log message.
 */
function formatExtraDetails(details) {
    return Object.entries(details)
        .map(([name, value]) => `${name}: ${serialize(value)}`)
        .join(EOL);
}

/**
 * Formats any metadata attached to the log message.
 * 
 * Error stacks are separated and printed as-is before other details.
 */
function formatMetadata({ stack, ...extra }) {
    const meta = isEmpty(extra) ? "" : formatExtraDetails(extra);
    return stack && meta ? [stack, meta].join(EOL) : stack || meta;
}

/**
 * Formats a log info object to a printable string.
 */
export default function formatLog(info) {
    const message = formatMessage(info);
    const metadata = formatMetadata(info.metadata);
    return metadata ? [message, indent(metadata, 4)].join(EOL) : message;
}
