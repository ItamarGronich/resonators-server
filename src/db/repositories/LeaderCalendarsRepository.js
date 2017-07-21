import Repository from './Repository';
import {leader_calendars} from '../sequelize/models';
import db from '../sequelize/dbConnection';
import * as dbToDomain from '../dbToDomain';

class LeaderCalendarsRepository extends Repository {
    constructor(...args) {
        super(...args);
    }

    toDbEntity(leaderCalendar) {
        return {
            ...leaderCalendar
        };
    }

    save(leaderCalendar, transaction) {
        return leader_calendars.create(leaderCalendar, {transaction});
    }

    //[{leader, googleAccount}]
    async getGoogleAccountsWithoutCalendars() {
        const sql =
            `select l.id as leader_id, ga.id as google_account_id, ga.*, l.* ` +
            `from leaders l ` +
            `join google_accounts ga on ga.user_id = l.user_id ` +
            `left join leader_calendars lc on lc.leader_id = l.id ` +
            `where lc.leader_id is null`;

        const [rows] = await db.query(sql);

        const wrapRow = row => ({ get: (col) => row[col] });

        const entities = rows.map(row => {
            const googleAccount = dbToDomain.toGoogleAccount(wrapRow({
                ...row,
                id: row.google_account_id
            }));

            const leader = dbToDomain.toLeader(wrapRow({
                ...row,
                id: row.leader_id
            }));

            return { leader, googleAccount };
        });

        return entities;
    }
}

export default new LeaderCalendarsRepository();
