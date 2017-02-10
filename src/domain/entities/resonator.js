export default class Resonator {
    constructor({
        id,
        leader_id,
        follower_id,
        title,
        link,
        description,
        content,
        pop_email,
        pop_location_lat,
        pop_location_lng,
        pop_time,
        repeat_days,
        last_pop_time,
        disable_copy_to_leader,
        created_at,
        updated_at
    }) {
        this.id = id;
        this.leader_id = leader_id;
        this.follower_id = follower_id;
        this.description = description;
        this.title = title;
        this.link = link;
        this.content = content;
        this.pop_email = pop_email;
        this.pop_location_lat = pop_location_lat;
        this.pop_location_lng = pop_location_lng;
        this.pop_time = pop_time;
        this.repeat_days = repeat_days;
        this.last_pop_time = last_pop_time;
        this.disable_copy_to_leader = disable_copy_to_leader;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
