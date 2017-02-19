import dbCfg from '../db/sequelize/config/config';

export default {
    db: {...dbCfg.test, options: { logging: false }},
    emailSchedulerOn: false
};
