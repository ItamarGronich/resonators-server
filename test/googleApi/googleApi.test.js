import fetchBasicDetails from '../../src/google/fetchBasicDetails.prod';
import * as calendarApi from '../../src/google/calendarApi';
import {assert} from 'chai';

//abate.nothing@gmail.com
const tokens = {
    access_token: 'ya29.Glt5BCJ_r_7dTIIOgwSG1zPWKaulgQEtsmmZ6nIh0LkodmtCG4Rp9n5YOnLN2AXg5k0aeCeg16r3c8vqgi8Wu8K3SOP4k3NapHZQ5VHm6EfT5a0iXrayDluepjem',
    refresh_token: '1/d9cIGrtr_onHV-RmEE6B2TS9YXQDhp8P1xCnD2IMOpU'
};

describe('google api', function() {
    this.timeout(60000);

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

            const id = await createCalendar();

            assert.isOk(id);

            await removeCalendar(id);
        });

        it('create event', async () => {
            const calendarId = await createCalendar();
            const ev = await createEvent(calendarId);
            assert.isOk(ev.id);
            assert.equal(ev.status, 'confirmed');
            await removeCalendar(calendarId);
        });

        it('edit event', async () => {
            const calendarId = await createCalendar();

            const createdEvent = await createEvent(calendarId);

            await calendarApi.updateEvent(tokens, {
                calendarId,
                eventId: createdEvent.id,
                resource: {
                    description: 'overridden'
                }
            });

            const updatedEvents = await getEvents(calendarId);

            assert.equal(updatedEvents.items[0].description, 'overridden');

            await removeCalendar(calendarId);
        });

        it('delete event', async () => {
            const calendarId = await createCalendar();
            const event = await createEvent(calendarId);
            await deleteEvent(calendarId, event.id);
            const events = await getEvents(calendarId);
            assert.equal(events.items.length, 0);
        });

        it('get events', async () => {
            const calendarId = await createCalendar();
            const createdEvent = await createEvent(calendarId);
            const events = await getEvents(calendarId);

            assert.equal(events.items.length, 1);
            const firstEvent = events.items[0];
            assert.equal(firstEvent.id, createdEvent.id);
            assert.equal(firstEvent.status, 'confirmed');
            await removeCalendar(calendarId);
        });

        async function createCalendar() {
            const {id} = await calendarApi.createCalendar(tokens, {
                resource: {
                    summary: 'Resonators'
                }
            });

            return id;
        }

        function removeCalendar(id) {
            return calendarApi.removeCalendar(tokens, id);
        }

        function createEvent(calendarId) {
            return calendarApi.createEvent(tokens, calendarId);
        }

        function deleteEvent(calendarId, eventId) {
            return calendarApi.deleteEvent(tokens, calendarId, eventId);
        }

        function getEvents(calendarId) {
            return calendarApi.getEvents(tokens, calendarId);
        }
    });
});
