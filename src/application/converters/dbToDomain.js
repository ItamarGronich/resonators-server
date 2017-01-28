import User from '../../domain/user';

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
