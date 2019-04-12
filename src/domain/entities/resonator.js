import _ from 'lodash';
import uuid from 'uuid/v4';
import ResonatorAttachment from './resonatorAttachment';

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
        items,
        questions,
        created_at,
        updated_at
    }) {
        // if (!leader_id)
        //     throw new Error('resonator must have a leader_id');
        // if (!follower_id)
        //     throw new Error('resonator must have a follower_id');
        //
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
        this.repeat_days = repeat_days || [];
        this.last_pop_time = last_pop_time;
        this.disable_copy_to_leader = disable_copy_to_leader;
        this.items = items || [];
        this.questions = questions || [];
        this.created_at = created_at;
        this.updated_at = updated_at;

        if (!id)
            this.id = uuid();
    }

    addQuestion(question_id) {
        this.questions.push({
            id: uuid(),
            question_id,
            resonator_id: this.id
        });
    }

    addItem(item) {
        const attachment = new ResonatorAttachment(item);
        attachment.resonator_id = this.id;
        attachment.visible = 1;
        this.items.push(attachment);
        return attachment;
    }

    removeQuestion(question_id) {
        this.questions = this.questions.filter(q => q.id !== question_id);
    }

    removeItem(itemId) {
        this.items = this.items.filter(i => i.id !== itemId);
    }

    getImage() {
        const picture = _(this.items)
            .filter(i => i.media_kind === 'image' ||
                i.media_kind === 'picture')
            .orderBy('created_at', ['desc'])
            .head();

        if (picture) {
            if (picture.link)
                return picture.link;
            else
                return `https://reminders-uploads.s3.amazonaws.com/${picture.media_id}.jpg`;
        } else
            return '';
    }

    getImage(itemId) {
        const picture = _(this.items)
            .filter(i => i.id === itemId)
            .orderBy('created_at', ['desc'])
            .head();
        return picture;
    }

    getResonatorQuestionId(question_id) {
        const q = _.find(this.questions, q => q.question_id === question_id);
        return q ? q.id : null;
    }
}
