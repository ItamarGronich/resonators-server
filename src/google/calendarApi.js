import google from 'googleapis';
import dispatch from './dispatcher';

const calendar = google.calendar('v3');

//{items}
export function listCalendars(tokens) {
    return dispatch(calendar.calendarList.list, tokens);
}

//{kind, etag, id, summary}
export function createCalendar(tokens, params) {
    return dispatch(calendar.calendars.insert, tokens, params);
}

//void
export function removeCalendar(tokens, calendarId) {
    return dispatch(calendar.calendarList.delete, tokens, {
        calendarId
    });
}

export function createEvent() {
}
