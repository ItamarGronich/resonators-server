import path from "path";

import dbCfg from "../db/sequelize/config/config";

export default {
    db: {
        ...dbCfg.development,
        options: {
            logging: false,
        },
    },
    host: "http://localhost:8080/",
    port: 8080,
    scheduler: {
        on: true,
        interval: 10 * 1000,
    },
    logging: {
        directory: path.join(__dirname, "../../logs"),
        maxFileSize: 1024 * 1024,
        maxFiles: 10,
        timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
        metadataIndentation: 4,
    },
};
