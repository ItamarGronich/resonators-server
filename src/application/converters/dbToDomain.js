import User from '../../domain/user';

export function toUser(dbUser) {
    return new User(dbUser);
}
