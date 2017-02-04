import {clinics} from '../db/sequelize/models';

export async function getLeaderClinics(user_id) {
    const rows = await clinics.findAll({
        user_id
    });

    const foundClinics = rows.map(r => ({
        id: r.get('id'),
        user_id: r.get('user_id'),
        name: r.get('name')
    }));

    return foundClinics;
}
