import _ from 'lodash';

export function toUser(user) {
    return {
        name: user.name,
        email: user.email,
        country: user.country,
        unsubscribed: user.unsubscribed
    };
};

export function toFollower(follower) {
    let dto = {
        ...follower,
    };

    if (follower.user)
        dto.user = toUser(follower.user);

    return dto;
}

export function toResonator(resonator) {
    const dto = _.pick(resonator,
                       'id',
                       'leader_id',
                       'follower_id',
                       'title',
                       'content',
                       'description',
                       'link',
                       'disable_copy_to_leader',
                       'follower_id',
                       'repeat_days',
                       'items',
                       'questions',
                       'created_at',
                       'updated_at'
                      );

    dto.items = _.orderBy(dto.items, i => i.created_at, 'desc');
    dto.questions = _.orderBy(dto.questions, i => i.created_at, 'desc');
    return dto;
}

export function toQuestion(question) {
    return question;
}
