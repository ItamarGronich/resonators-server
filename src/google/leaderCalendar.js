import dispatch from "./dispatcher";
import { google } from "googleapis";
import FollowerRepository from "../db/repositories/FollowerRepository";
import cfg from "../cfg";

const calendar = google.calendar('v3');

export default async function addResonatorsLinkToGoogleCalendar(tokens, user_id) {
    const calendars = await dispatch(calendar.calendarList.list.bind(calendar.calendarList), tokens, {minAccessRole: "writer"});
    calendars?.data?.items?.map(async (foundCalendar) => {
        const calendarEvents = await dispatch(calendar.events.list.bind(calendar.events), tokens, {
            calendarId: foundCalendar.id,
            maxResults: 100,
            timeMin: new Date().toISOString()
        });
        const calendarEventsWithAttendees = calendarEvents.data?.items?.filter(event => event.attendees?.length > 0) || [];
        calendarEventsWithAttendees.map((event) => {
            event.attendees.map(async (attendee) => {
                if (!attendee.organizer && !attendee.self) {
                    const follower = await FollowerRepository.findByUserEmail(attendee.email, user_id);
                    if (follower) {
                        const link = cfg.host + 'followers/' + follower.id + '/resonators';
                        const linkMessage = `To open the Follower's page on the Resonators system for ${follower.user.name} click the following link:\n` + link;
                        if (!event.description?.includes(linkMessage)) {
                            event.description = event.description ? (event.description + '\n==========\n' + linkMessage) : linkMessage;
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
