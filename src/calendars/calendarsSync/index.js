import leaderCalendarRepository from '../../db/repositories/LeaderCalendarsRepository.js';
import {createCalendar} from '../../google/calendarApi';
import LeaderCalendar from '../../domain/entities/leaderCalendar';
import createUow from '../../application/createUow';
import {calendarsSyncLog as log} from '../../infra/log';

const ResonatorsCalendarName = 'Resonators';
const CreateCalendarsInteval = 5000;
let stopped = true;

export function start() {
    stopped = false;

    loopSyncCalendars();
}

export function stop() {
    stopped = true;
}

async function loopSyncCalendars() {
    try {
        if (stopped)
            return;

        await createCalendarsForGoogleUsers();
    } catch (err) {
        log.error('failed syncing calendars', err);
    }

    setTimeout(createCalendarsForGoogleUsers, CreateCalendarsInteval);
}

async function createCalendarsForGoogleUsers() {
    const accountsWithoutCalendars = await
        leaderCalendarRepository.getGoogleAccountsWithoutCalendars();

    const uow = createUow();

    for (const account of accountsWithoutCalendars) {
        try {
            const {leader, googleAccount} = account;

            const calendar = await createCalendar(googleAccount.getTokens(), {
                resource: {
                    summary: ResonatorsCalendarName
                }
            });

            if (calendar) {
                const calendar_id = calendar.id;
                uow.trackEntity(new LeaderCalendar({ leader_id: leader.id, calendar_id }), {isNew: true});
            }
        } catch (err) {
            log.error('failed syncing calendar for google account', err);
        }
    }

    await uow.commit();
}
