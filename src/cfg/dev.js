import dbCfg from '../db/sequelize/config/config';

export default {
    db: {
        ...dbCfg.development,
        options: {
            logging: false
        }
    },
    emailSchedulerOn: true
};
