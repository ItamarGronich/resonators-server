import { QueryTypes } from "sequelize";

import db from "../../db/sequelize/dbConnection";

function buildQuery(timestamp) {
    return `SELECT r.id FROM resonators r
         LEFT JOIN followers f ON f.id = r.follower_id
         LEFT JOIN users fu ON fu.id = f.user_id
         LEFT JOIN leaders l ON l.id = r.leader_id
         LEFT JOIN users lu ON lu.id = l.user_id
         LEFT JOIN resonators pr ON r.parent_resonator_id = pr.id
         LEFT JOIN follower_groups fg ON pr.follower_group_id = fg.id
             WHERE (r.last_pop_time IS NOT NULL OR ${timestamp}::timestamp > r.pop_time::timestamp)
               AND (r.last_pop_time IS NULL OR date(${timestamp}) >= date(coalesce(r.last_pop_time, '1970-01-01')))
               AND ${timestamp}::timestamp::time >= r.pop_time::time
               AND position(extract(dow from ${timestamp}::timestamp)::char IN r.repeat_days) > 0
               AND (r.last_pop_time IS NULL OR ((extract(week from ${timestamp}::timestamp) - extract(week from r.last_pop_time::timestamp))::int % r.interval = 0))
               AND r.pop_email
               AND pr.pop_email IS NULL OR pr.pop_email
               AND NOT f.frozen
               AND NOT fg.frozen
               AND fu.id IS NOT NULL
               AND lu.id IS NOT NULL
               AND r.follower_group_id IS NULL`;
}

function formatTimestamp(datetime) {
    return `'${datetime.toJSON()}'`;
}

function executeRawSql(sql) {
    return db.query(sql, { type: QueryTypes.SELECT });
}

function extractIds(queryResults) {
    return queryResults.map((result) => result.id);
}

export default function fetchPendingResonators(asOf) {
    return executeRawSql(buildQuery(formatTimestamp(asOf || new Date()))).then(extractIds);
}
