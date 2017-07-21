import _ from 'lodash';
import fetchBasicDetails from '../../src/google/fetchBasicDetails.prod';
import * as calendarApi from '../../src/google/calendarApi';
import {assert} from 'chai';

//abate.nothing@gmail.com
const tokens = {
    access_token: 'ya29.Glt5BCJ_r_7dTIIOgwSG1zPWKaulgQEtsmmZ6nIh0LkodmtCG4Rp9n5YOnLN2AXg5k0aeCeg16r3c8vqgi8Wu8K3SOP4k3NapHZQ5VHm6EfT5a0iXrayDluepjem',
    refresh_token: '1/d9cIGrtr_onHV-RmEE6B2TS9YXQDhp8P1xCnD2IMOpU'
};

describe('google api', function() {
    this.timeout(20000);

    it('fetch details', async () => {
        const details = await fetchBasicDetails(tokens);

        assert.deepEqual(details, {
            name: 'Winston Smith',
            email: 'abate.nothing@gmail.com'
        });
    });

    describe('calendarApi', () => {
        it('list calendars', async () => {
            const calendars = await calendarApi.listCalendars(tokens);
            assert.isAbove(calendars.items.length, 0, 'should have at least 1 calendar');
        });

        it('create + remove calendar', async function() {
            this.timeout(20000);

            const {id} = await calendarApi.createCalendar(tokens, {
                resource: {
                    summary: 'Resonators'
                }
            });

            assert.isOk(id);

            await calendarApi.removeCalendar(tokens, id);
        });

        it('edit event', async () => {
            const calendarId = '0dr2hrboeic2l2rdm22fl82oss@group.calendar.google.com';

            const events = await calendarApi.getEvents(tokens, calendarId);

            const lastEventId = _.last(events.items).id;

            await calendarApi.updateEvent(tokens, {
                calendarId,
                eventId: lastEventId,
                resource: {
                    description: 'overridden'
                }
            });
        });
    });
});
