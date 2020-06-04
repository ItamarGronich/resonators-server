import secrets from './secrets';

export default {
    db: {
        ...secrets.prodDb,
        options: {
            logging: false
        }
    },
    emailSchedulerOn: true
};
