import _ from 'lodash';
import User from '../domain/entities/user';
import Leader from '../domain/entities/leader';
import Follower from '../domain/entities/follower';
import Invitation from '../domain/entities/invitation';
import Resonator from '../domain/entities/resonator';
import Question from '../domain/entities/question';
import ResonatorAttachment from '../domain/entities/resonatorAttachment';
import SentResonator from '../domain/entities/sentResonator';
import GoogleAccount from '../domain/entities/googleAccount';
import GoogleContact from '../domain/entities/googleContact';
import GooglePhoto from '../domain/entities/googlePhoto';
import LeaderClinic from '../domain/entities/leaderClinic';
import FollowerGroup from '../domain/entities/followerGroup';
import FollowerGroupFollower from '../domain/entities/followerGroupFollower';


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
        id: r.get('id'),
        user_id: r.get('user_id'),
        title: r.get('title'),
        description: r.get('description'),
        visible: r.get('visible'),
        current_clinic_id: r.get('current_clinic_id'),
        group_permissions: r.get('group_permissions'),
        admin_permissions: r.get('admin_permissions'),
        clinic_branding: r.get('clinic_branding')
    });
}

export function toFollower(r, stndaln = false) {
    const groups = r.get('follower_group_followers')?.map((group) => group.get('follower_group_id')) || [];

    return new Follower({
        id: r.get('id'),
        user: r.user && toUser(r.user),
        user_id: r.get('user_id'),
        leader_id: r.get('leader_id'),
        clinic_id: r.get('clinic_id'),
        status: r.get('status'),
        frozen: !!r.get('frozen'),
        is_system: !!r.get('is_system'),
        groups: (groups?.length > 0 && !stndaln) ? groups : [...groups, "STNDALN"],
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt')
    });
}

export function toInvitation(r) {
    return new Invitation({
        id: r.get('id'),
        user_id: r.get('user_id'),
        title: r.get('title'),
        subject: r.get('subject'),
        body: r.get('body'),
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt')
    });
}

export function toResonator(r) {
    const resonator_attachments = _.map(r.resonator_attachments, toResonatorAttachment);
    const resonator_questions = _(r.resonator_questions).map(toResonatorQuestion).orderBy(rq => [rq.order, rq.updatedAt], ['ASC', 'DESC']).value();
    let repeat_days = r.get('repeat_days');
    repeat_days = repeat_days ? repeat_days.split(',').map(s => parseInt(s)) : [];

    return new Resonator({
        id: r.get('id'),
        leader_id: r.get('leader_id'),
        follower_id: r.get('follower_id'),
        follower_group_id: r.get('follower_group_id'),
        parent_resonator_id: r.get('parent_resonator_id'),
        description: r.get('description'),
        title: r.get('title'),
        link: r.get('link'),
        content: r.get('content'),
        pop_email: r.get('pop_email'),
        pop_location_lat: r.get('pop_location_lat'),
        pop_location_lng: r.get('pop_location_lng'),
        pop_time: r.get('pop_time'),
        repeat_days,
        last_pop_time: r.get('last_pop_time'),
        disable_copy_to_leader: r.get('disable_copy_to_leader'),
        one_off: r.get('one_off'),
        ttl_policy: r.get('ttl_policy'),
        interaction_type: r.get('interaction_type'),
        selected_questionnaire: r.get('selected_questionnaire'),
        questionnaire_details: r.get('questionnaire_details'),
        interval: r.get('interval'),
        items: resonator_attachments,
        questions: resonator_questions,
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt')
    });
}

function toResonatorAttachment(r) {
    return new ResonatorAttachment({
        id: r.get('id'),
        resonator_id: r.get('resonator_id'),
        media_kind: r.get('media_kind'),
        media_format: r.get('media_format'),
        media_id: r.get('media_id'),
        title: r.get('title'),
        visible: r.get('visible'),
        owner_id: r.get('owner_id'),
        owner_role: r.get('owner_role'),
        link: r.get('link'),
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt')
    });
}

function toResonatorQuestion(r) {
    const question = toQuestion(r.get('question'));

    return {
        id: r.get('id'),
        question_id: r.get('question_id'),
        resonator_id: r.get('resonator_id'),
        removed: r.get('removed'),
        order: r.get('order'),
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt'),
        question
    };
}

export function toQuestion(r) {
    const answers = (r.answers || []).map(toAnswer);

    return new Question({
        id: r.get('id'),
        leader_id: r.get('leader_id'),
        question_kind: r.get('question_kind'),
        description: r.get('description'),
        title: r.get('title'),
        is_system: r.get('is_system'),
        tags: r.get('tags'),
        removed: r.get('removed'),
        clinic_id: r.get('clinic_id'),
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt'),
        answers
    });
}

function toAnswer(r) {
    return {
        id: r.get('id'),
        body: r.get('body'),
        rank: r.get('rank')
    };
}

export function toSentResonator(r) {
    return new SentResonator({
        id: r.get('id'),
        resonator_id: r.get('resonator_id'),
        expiry_date: r.get('expiry_date'),
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt')
    });
}

export function toGoogleAccount(row) {
    return new GoogleAccount({
        id: row.get('id'),
        id_token: row.get('id_token'),
        access_token: row.get('access_token'),
        refresh_token: row.get('refresh_token'),
        access_token_expiry_date: row.get('access_token_expiry_date'),
        user_id: row.get('user_id'),
        google_email: row.get('google_email')
    });
}

export function toGoogleContact(row) {
    return new GoogleContact({
       id: row.get('id'),
       user_id: row.get('user_id'),
       name: row.get('name'),
       email: row.get('email')
    });
}

export function toGooglePhoto(row) {
    return new GooglePhoto({
        id: row.get('id'),
        user_id: row.get('user_id'),
        image: row.get('image'),
        description: row.get('description')
    });
}

export function toLeaderClinic(r) {
    const leader = toLeader(r.get('leader'));

    return new LeaderClinic({
        leader_id: r.get('leader_id'),
        clinic_id: r.get('clinic_id'),
        is_primary: r.get('is_primary'),
        is_leader_accepted: r.get('is_leader_accepted'),
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt'),
        leader
    });
}

export function toFollowerGroup(r) {
    return new FollowerGroup({
        id: r.get('id'),
        group_name: r.get('group_name'),
        leader_id: r.get('leader_id'),
        clinic_id: r.get('clinic_id'),
        status: r.get('status'),
        frozen: !!r.get('frozen'),
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt')
    });
}

export function toFollowerGroupFollower(r) {
    return new FollowerGroupFollower({
        id: r.get('id'),
        follower_group_id: r.get('follower_group_id'),
        follower_id: r.get('follower_id'),
        createdAt: r.get('createdAt'),
        updatedAt: r.get('updatedAt')
    });
}
