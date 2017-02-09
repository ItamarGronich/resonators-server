import User from '../domain/entities/user';
import Follower from '../domain/entities/follower';

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

export function toFollower(r) {
    return new Follower({
        id: r.get('id'),
        user: toUser(r.user),
        user_id: r.get('user_id'),
        leader_id: r.get('leader_id'),
        clinic_id: r.get('clinic_id'),
        status: r.get('status'),
        created_at: r.get('created_at'),
        updated_at: r.get('updated_at')
    });
}
