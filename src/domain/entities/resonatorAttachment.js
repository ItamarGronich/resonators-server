import { v4 as uuid } from "uuid";

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
        createdAt,
        updatedAt
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
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        if (!id)
            this.id = uuid();
    }
}
