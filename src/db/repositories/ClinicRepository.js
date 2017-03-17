import _ from 'lodash';
import * as dbToDomain from '../dbToDomain';
import Repository from './Repository';
import {users, clinics} from '../sequelize/models';

class ClinicRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(clinic) {
        return {
            ...clinic
        };
    }

    async save(clinic, transaction, lastClinic) {
        return await clinics.create(clinic, {transaction});
    }
}

export default new ClinicRepository();
