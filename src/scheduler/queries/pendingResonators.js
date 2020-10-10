import { QueryTypes } from "sequelize";

import db from "../../db/sequelize/dbConnection";

const QUERY = `
  SELECT r.id FROM resonators r
LEFT JOIN followers f ON f.id = r.follower_id
LEFT JOIN resonators pr ON r.parent_resonator_id = pr.id
LEFT JOIN follower_groups fg ON pr.follower_group_id = fg.id
    WHERE (r.last_pop_time IS NOT NULL OR CURRENT_TIMESTAMP > r.pop_time::timestamp)
      AND (r.last_pop_time IS NULL OR CURRENT_DATE >= date(coalesce(r.last_pop_time, '1970-01-01')))
      AND (r.last_pop_time IS NULL OR NOT (date(r.last_pop_time) = CURRENT_DATE AND r.last_pop_time::timestamp::time > r.pop_time::timestamp::time))
      AND CURRENT_TIME >= r.pop_time::time
      AND position(extract(dow from CURRENT_TIMESTAMP)::char IN r.repeat_days) > 0
      AND (r.last_pop_time IS NULL OR ((extract(week from CURRENT_TIMESTAMP) - extract(week from r.last_pop_time::timestamp))::int % r.interval = 0))
      AND r.pop_email
      AND NOT f.frozen
      AND (r.parent_resonator_id IS NULL OR (pr.pop_email AND NOT fg.frozen))
      AND r.follower_group_id IS NULL`;

function executeRawSql(sql) {
    return db.query(sql, { type: QueryTypes.SELECT });
}

function extractIds(queryResults) {
    return queryResults.map((result) => result.id);
}

export default function fetchPendingResonators() {
    return executeRawSql(QUERY).then(extractIds);
}
