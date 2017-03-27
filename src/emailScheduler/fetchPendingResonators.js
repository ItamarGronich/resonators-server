import db from '../db/sequelize/dbConnection';
import {resonators} from '../../src/db/sequelize/models';

export default function fetchPendingResonators(getNow = (() => new Date())) {
    const now = "'" + getNow().toJSON() + "'";

    const sql = `select r.id from resonators r ` +
        `left join followers f on f.id = r.follower_id ` +
        `left join users fu on fu.id = f.user_id ` +
        `left join leaders l on l.id = r.leader_id ` +
        `left join users lu on lu.id = l.user_id ` +
        `where (last_pop_time is not null or ${now}::timestamp > pop_time::timestamp) and ` +
        `(last_pop_time is null or date(${now}) > date(coalesce(last_pop_time, '1970-01-01'))) and ` +
        `${now}::timestamp::time >= pop_time::time and ` +
        `position(extract(dow from ${now}::timestamp)::char in repeat_days) > 0 and ` +
        `pop_email = true and ` +
        `fu.id is not null and ` +
        `lu.id is not null`;

    return db.query(sql).spread(rows => rows.map(r => r.id));
}
