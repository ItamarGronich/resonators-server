import secrets from "./secrets";

export default {
    db: {
        ...secrets.prodDb,
        options: {
            logging: false,
        },
    },
    port: 8080,
    emailSchedulerOn: true,
    logging: {
        directory: "/var/log/resonators",
        maxFileSize: 1024 * 1024 * 10,
        maxFiles: 20,
    },
};
