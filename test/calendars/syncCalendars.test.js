import _ from 'lodash';
import proxyquire from 'proxyquire';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {leader_calendars} from '../../src/db/sequelize/models';
import sinon from 'sinon';
import waitFor from 'wait-for-cond';
import uuid from 'uuid/v4';

describe('sync calendars', () => {
    let calendarsSync, createCalendarStub;

    beforeEach(() => {
        createCalendarStub = sinon.stub();

        calendarsSync = proxyquire('../../src/calendars/calendarsSync', {
            '../../google/calendarApi': {
                createCalendar: createCalendarStub
            }
        });
    });

    describe('create a new Resonators calendar for new users', function() {
        this.timeout(5000);

        let userGoogleAccount, leader, calendarId;

        afterEach(() => {
            calendarsSync.stop();
        });
    
        it('should save the google calendar in our DB', async () => {
            await run();

            return waitFor(() => {
                return leader_calendars.findOne({ where: {calendar_id: calendarId } });
            }, 4000);
        });

        it('should not create the calendar for existing users', async function() {
            this.timeout(5000);

            const [leader_calendar] = await generateFixtures()
                .generateLeaderCalendar()
                .done();

            const [google_account] = await generateFixtures()
                .generateGoogleAccount({user: leader_calendar.leader.user})
                .done();

            run();

            return waitFor.hold(() => {
                const tokens = _.pick(google_account, ['access_token', 'refresh_token', 'access_token_expiry_date']);
                return !createCalendarStub.calledWithMatch(tokens);
            }, 4000);
        });

        async function run() {
            calendarId = uuid();

            ([userGoogleAccount] = await generateFixtures()
                .generateGoogleAccount()
                .done());

            ([leader] = await generateFixtures()
                .generateLeader({user: userGoogleAccount.user})
                .done()
            );

            createCalendarStub.withArgs(
                _.pick(userGoogleAccount, ['access_token', 'refresh_token', 'access_token_expiry_date']), {
                resource: {
                    summary: 'Resonators'
                }
            }).returns({ id: calendarId });

            calendarsSync.start();
        }
    });
});
