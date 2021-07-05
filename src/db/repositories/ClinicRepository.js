import Repository from './Repository';
import {clinics} from '../sequelize/models';
import db from '../sequelize/dbConnection';

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
            createdAt: r.get('createdAt'),
            updatedAt: r.get('updatedAt'),
        }));
    
        return foundClinics;
    }

    async findAllClinicsRaw() {
        const sql = `SELECT c.id, c.user_id, c.name, l.title leader_name, l.id leader_id, u.email leader_email
            FROM leaders l
            JOIN clinics c ON l.current_clinic_id = c.id
            JOIN users u ON u.id = l.user_id
            WHERE l.title IS NOT NULL
            AND l.clinic_gdrive`;
        const [rows] = await db.query(sql);

        return rows;
    }

    async findClinicFollowersRaw(clinicId) {
        const sql = `SELECT f.id, f.user_id, f.leader_id, f.status, f.frozen, u.name
            FROM followers f
            JOIN users u ON u.id = f.user_id
            JOIN leaders l ON l.user_id = f.user_id
            WHERE NOT f.is_system
            AND f.clinic_id = '${clinicId}'
            AND l.clinic_gdrive`;
        const [rows] = await db.query(sql);

        return rows;
    }

    async addFollowerGDriveLink(followerId, link) {
        const sql = `UPDATE followers SET gdrive_link = '${link}' WHERE id = '${followerId}'`;

        await db.query(sql);
    }
}

export default new ClinicRepository();
