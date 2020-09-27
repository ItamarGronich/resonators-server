import leaderCalendarRepository from '../../db/repositories/LeaderCalendarsRepository.js';
import {createCalendar} from '../../google/calendarApi';
import LeaderCalendar from '../../domain/entities/leaderCalendar';
import createUow from '../../application/createUow';
import {calendarsSyncLog as log} from '../../logging/log';
import createJob from '../../createJob';

const ResonatorsCalendarName = 'Resonators';
const CreateCalendarsInteval = 30 * 1000;

export default createJob({
    runner: createCalendarsForGoogleUsers,
    interval: CreateCalendarsInteval,
    onStart: () => log.info('starting loop'),
    onStop: () => log.info('stopping loop'),
    onError: err => log.error('failed syncing calendars', err)
});

async function createCalendarsForGoogleUsers() {
    const accountsWithoutCalendars = await
        leaderCalendarRepository.getGoogleAccountsWithoutCalendars();

    log.info(`[CalendarSync] fetched ${accountsWithoutCalendars.length} pending accounts`);

    const uow = createUow();

    for (const account of accountsWithoutCalendars) {
        try {
            const {leader, googleAccount} = account;

            log.info(`creating a Resonators calendar for googleAccountId: ${googleAccount.id}`);

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
