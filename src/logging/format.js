import { EOL } from "os";
import { isEmpty } from "lodash";
import indent from "indent-string";

function formatMessage({ timestamp, level, label, message }) {
    return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
}

function stringify(value) {
    return JSON.stringify(value, null, 2);
}

function formatMetaValue([name, value]) {
    if (name === "stack") {
        // print error stacks as-is
        return value;
    }
    return `${name}: ${stringify(value)}`;
}

function formatMetadata(metadata) {
    return isEmpty(metadata) ? "" : Object.entries(metadata).map(formatMetaValue).join(EOL);
}

export default function formatLog(info) {
    const message = formatMessage(info);
    const metadata = formatMetadata(info.metadata);
    return metadata ? [message, indent(metadata, 2)].join(EOL) : message;
}
