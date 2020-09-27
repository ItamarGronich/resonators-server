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
    logDirectory: "/var/log/resonators",
};
