import db from '../db/sequelize/dbConnection';
import {resonators} from '../../src/db/sequelize/models';

export default async function fetchPendingResonators(getNow = (() => new Date())) {
    const now = "'" + getNow().toJSON() + "'";

    const sql = `select id from resonators ` +
                `where date_part('day', ${now} - coalesce(last_pop_time, '1970-1-1')) >= 1 and ` +
                `${now}::timestamp::time >= pop_time::time and ` +
                `position(extract(dow from ${now}::timestamp)::char in repeat_days) > 0`;

    return db.query(sql).spread(rows => rows.map(r => r.id));
}
