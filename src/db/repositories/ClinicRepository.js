import Repository from './Repository';
import {clinics} from '../sequelize/models';

class ClinicRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(clinic) {
        return {
            ...clinic
        };
    }

    save(clinic, transaction) {
        return clinics.create(clinic, {transaction});
    }
}

export default new ClinicRepository();
