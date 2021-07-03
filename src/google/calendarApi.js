import { google } from 'googleapis';
import dispatch from './dispatcher';

const calendar = google.calendar('v3');

//{items}
export function listCalendars(tokens) {
    return dispatch(calendar.calendarList.list.bind(calendar.calendarList), tokens);
}

//{kind, etag, id, summary}
export function createCalendar(tokens, params) {
    return dispatch(calendar.calendars.insert.bind(calendar.calendars), tokens, params);
}

//void
export function removeCalendar(tokens, calendarId) {
    return dispatch(calendar.calendarList.delete.bind(calendar.calendarList), tokens, {
        calendarId
    });
}

export function updateEvent(tokens, params) {
    return dispatch(calendar.events.patch, tokens, params);
}

export function getEvents(tokens, calendarId) {
    return dispatch(calendar.events.list, tokens, {
        calendarId
    });
}

export function createEvent(tokens, calendarId, start = '2019-01-01', end = '2019-01-02', params) {
    return dispatch(calendar.events.insert, tokens, {
        calendarId,
        resource: {
            start: {
                date: start
            },
            end: {
                date: end
            },
            ...params
        }
    });
}

export function deleteEvent(tokens, calendarId, eventId) {
    return dispatch(calendar.events.delete, tokens, { calendarId, eventId });
}
