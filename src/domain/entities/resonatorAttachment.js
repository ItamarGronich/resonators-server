import uuid from 'uuid/v4';

export default class ResonatorAttachment {
    constructor({
        id,
        resonator_id,
        media_kind,
        media_format,
        media_id,
        title,
        visible,
        owner_id,
        owner_role,
        link,
        created_at,
        updated_at
    }) {
        this.id = id;
        this.resonator_id = resonator_id;
        this.media_kind = media_kind;
        this.media_format = media_format;
        this.media_id = media_id;
        this.title = title;
        this.visible = visible;
        this.owner_id = owner_id;
        this.owner_role = owner_role;
        this.link = link;
        this.created_at = created_at;
        this.updated_at = updated_at;

        if (!id)
            this.id = uuid();
    }
}
