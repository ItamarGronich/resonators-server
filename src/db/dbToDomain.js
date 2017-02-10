import User from '../domain/entities/user';
import Leader from '../domain/entities/leader';
import Follower from '../domain/entities/follower';
import Resonator from '../domain/entities/resonator';

export function toUser(dbUser) {
    return new User({
        id: dbUser.get('id'),
        name: dbUser.get('name'),
        email: dbUser.get('email'),
        unsubscribed: dbUser.get('unsubscribed'),
        country: dbUser.get('country'),
        pass: dbUser.get('pass'),
        salt: dbUser.get('salt')
    });
}

export function toLeader(r) {
    return new Leader({
        id: r.get('id')
    });
}

export function toFollower(r) {
    return new Follower({
        id: r.get('id'),
        user: r.user && toUser(r.user),
        user_id: r.get('user_id'),
        leader_id: r.get('leader_id'),
        clinic_id: r.get('clinic_id'),
        status: r.get('status'),
        created_at: r.get('created_at'),
        updated_at: r.get('updated_at')
    });
}

export function toResonator(r) {
    return new Resonator({
        id: r.get('id'),
        leader_id: r.get('leader_id'),
        follower_id: r.get('follower_id'),
        description: r.get('description'),
        title: r.get('title'),
        link: r.get('link'),
        content: r.get('content'),
        pop_email: r.get('pop_email'),
        pop_location_lat: r.get('pop_location_lat'),
        pop_location_lng: r.get('pop_location_lng'),
        pop_time: r.get('pop_time'),
        repeat_days: r.get('repeat_days'),
        last_pop_time: r.get('last_pop_time'),
        disable_copy_to_leader: r.get('disable_copy_to_leader'),
    });
}
