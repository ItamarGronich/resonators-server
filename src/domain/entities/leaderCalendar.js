import uuid from 'uuid/v4';

export default class LeaderCalendar {
    constructor({
        leader_id,
        calendar_id,
        events
    }) {
        this.leader_id = leader_id;
        this.calendar_id = calendar_id;
        this.events = events;
    }
}
