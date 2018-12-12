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
    async findByUserid(user_id)
    {
        const rows = await clinics.findAll({
            where: {
                user_id
            }
        });
    
        const foundClinics = rows.map(r => ({
            id: r.get('id'),
            user_id: r.get('user_id'),
            name: r.get('name'),
            created_at: r.get('created_at'),
            updated_at: r.get('updated_at'),
        }));
    
        return foundClinics;
    }
}

export default new ClinicRepository();
