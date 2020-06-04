import dbCfg from '../db/sequelize/config/config';

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
