import { QueryTypes } from "sequelize";

import db from "../../db/sequelize/dbConnection";

const QUERY = `
   SELECT r.id FROM resonators r
LEFT JOIN followers f ON f.id = r.follower_id
LEFT JOIN resonators pr ON pr.id = r.parent_resonator_id
LEFT JOIN follower_groups fg ON fg.id = pr.follower_group_id
    WHERE r.pop_email  -- resonator is enabled (activated)
      AND NOT f.frozen  -- follower is enabled (not suspended)
      AND r.follower_group_id IS NULL  -- not a group parent resonator
      AND (r.parent_resonator_id IS NULL OR (pr.pop_email AND NOT fg.frozen))  -- parent resonator and follower group enabled, if they exist
      AND position(extract(dow from CURRENT_TIMESTAMP)::char IN r.repeat_days) > 0  -- on one of configured days of the week
      AND CASE WHEN r.last_pop_time IS NULL THEN CURRENT_TIMESTAMP > r.pop_time::timestamp  -- don't send new resonaor today if created after its pop time
               ELSE CURRENT_TIME > r.pop_time::time  -- after configured time of day
                AND (extract(week from CURRENT_TIMESTAMP) - extract(week from r.last_pop_time::timestamp))::int % r.interval = 0  -- on correct week offset from last time
                AND r.last_pop_time::timestamp < CURRENT_DATE + r.pop_time::time  -- don't send if already sent after last pop time
          END`;

function executeRawSql(sql) {
    return db.query(sql, { type: QueryTypes.SELECT });
}

function extractIds(queryResults) {
    return queryResults.map((result) => result.id);
}

export default function fetchPendingResonators() {
    return executeRawSql(QUERY).then(extractIds);
}
