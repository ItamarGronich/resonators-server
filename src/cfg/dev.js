const dbCfg = require('../db/sequelize/config/config.json');

export default {
    db: {
        ...dbCfg.development,
        options: {
            logging: false
        }
    },
    host: 'http://localhost:8080/',
    emailSchedulerOn: true
};
