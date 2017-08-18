const dbCfg = require('../db/sequelize/config/config');

export default {
    db: {...dbCfg.test, options: { logging: false }},
    emailSchedulerOn: true,
    host: 'http://localhost:8080/'
};
