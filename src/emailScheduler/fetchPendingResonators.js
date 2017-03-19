import db from '../db/sequelize/dbConnection';
import {resonators} from '../../src/db/sequelize/models';

export default function fetchPendingResonators(getNow = (() => new Date())) {
    const now = "'" + getNow().toJSON() + "'";

    const sql = `select id from resonators ` +
                `where date(${now}) > date(coalesce(last_pop_time, pop_time)) and ` +
                `${now}::timestamp::time >= pop_time::time and ` +
                `position(extract(dow from ${now}::timestamp)::char in repeat_days) > 0`;

    return db.query(sql).spread(rows => rows.map(r => r.id));
}
