import _ from 'lodash';

export function toUser(user) {
    return {
        name: user.name,
        email: user.email,
        country: user.country,
        unsubscribed: user.unsubscribed
    };
}
export function toLeader(leader){
    return{
        id: leader.id,
        default_clinic_id:leader.default_clinic_id
    }
}
export function toFollower(follower) {
    let dto = {
        ...follower,
    };

    if (follower.user)
        dto.user = toUser(follower.user);

    return dto;
}

export function toResonator(resonator) {
    if (!resonator)
        return null;

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
                       'pop_email',
                       'pop_time',
                       'created_at',
                       'updated_at'
                      );

    dto.items = _.orderBy(dto.items, i => i.created_at, 'desc');
    return dto;
}

export function toQuestion(question) {
    return {
        ...question,
        answers: _.orderBy(question.answers, a => a.rank)
    };
}
