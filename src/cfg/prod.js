import secrets from "./secrets";

export default {
    db: {
        ...secrets.prodDb,
        options: {
            logging: false,
        },
    },
    port: 8080,
    scheduler: {
        on: true,
        interval: 60 * 1000,
    },
    GDriveClinicSync: false,
    logging: {
        directory: "/var/log/resonators",
        maxFileSize: 1024 * 1024 * 10,
        maxFiles: 20,
        timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
        metadataIndentation: 4,
    },
};
