import { EOL } from "os";
import { isEmpty } from "lodash";
import indent from "indent-string";

function formatMessage({ timestamp, level, label, message }) {
    return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
}

function serialize(value) {
    return JSON.stringify(value, null, 4);
}

function formatExtraDetails(details) {
    return Object.entries(details)
        .map(([name, value]) => `${name}: ${serialize(value)}`)
        .join(EOL);
}

function formatMetadata({ stack, ...extra }) {
    const meta = isEmpty(extra) ? "" : formatExtraDetails(extra);
    return stack && meta ? [stack, meta].join(EOL) : stack || meta;
}

export default function formatLog(info) {
    const message = formatMessage(info);
    const metadata = formatMetadata(info.metadata);
    return metadata ? [message, indent(metadata, 4)].join(EOL) : message;
}
