export function toUser(user) {
    return {
        name: user.name,
        email: user.email,
        country: user.country,
        unsubscribed: user.unsubscribed
    };
};

export function toFollower(follower) {
    return {
        ...follower,
        user: toUser(follower.user)
    };
}

export function toResonator(resonator) {
    return {
        ...resonator
    };
}
