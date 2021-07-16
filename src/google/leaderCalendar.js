import dispatch from "./dispatcher";
import { google } from "googleapis";
import FollowerRepository from "../db/repositories/FollowerRepository";
import cfg from "../cfg";

const calendar = google.calendar('v3');

export default async function addResonatorsLinkToGoogleCalendar(tokens, user_id) {
    const calendars = await dispatch(calendar.calendarList.list.bind(calendar.calendarList), tokens);
    calendars?.data?.items?.map(async (foundCalendar) => {
        const calendarEvents = await dispatch(calendar.events.list.bind(calendar.events), tokens, {calendarId: foundCalendar.id});
        const calendarEventsWithAttendees = calendarEvents.data?.items?.filter(event => event.attendees?.length > 0) || [];
        calendarEventsWithAttendees.map((event) => {
            event.attendees.map(async (attendee) => {
                if (!attendee.organizer && !attendee.self) {
                    const follower = await FollowerRepository.findByUserEmail(attendee.email, user_id);
                    if (follower) {
                        const link = cfg.host + 'followers/' + follower.id + '/resonators';
                        if (!event.description?.includes(link)) {
                            event.description = event.description ? (event.description + '\n' + link) : link;
                            await dispatch(calendar.events.update.bind(calendar.events), tokens, {
                                calendarId: foundCalendar.id,
                                eventId: event.id,
                                resource: event
                            });
                        }
                    }
                }
            });
        });
    });
}
