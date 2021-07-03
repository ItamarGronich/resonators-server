import dispatch from "./dispatcher";
import { google } from "googleapis";
import FollowerRepository from "../db/repositories/FollowerRepository";
import cfg from "../cfg";

const calendar = google.calendar('v3');

export default async function addResonatorsLinkToCalendar(tokens, user_id) {
    const calendarEvents = await dispatch(calendar.events.list.bind(calendar.events), tokens, {calendarId: "primary"});
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
                            calendarId: "primary",
                            eventId: event.id,
                            resource: event
                        });
                    }
                }
            }
        });
    });
}
