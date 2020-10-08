import dbCfg from "../db/sequelize/config/config";

export default {
    db: { ...dbCfg.test, options: { logging: false } },
    host: "http://localhost:8080/",
    scheduler: {
        on: true,
        interval: 10 * 1000,
    },
};
