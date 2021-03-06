import { v4 as uuid } from "uuid";

export default class Follower {
    constructor({
        id,
        user,
        user_id,
        leader_id,
        clinic_id,
        status,
        frozen,
        is_system,
        gdrive_link,
        groups,
        createdAt,
        updatedAt
    }) {
        this.id = id || uuid();
        this.user_id = user_id;
        this.user = user;
        this.leader_id = leader_id;
        this.clinic_id = clinic_id;
        this.status = status;
        this.frozen = frozen;
        this.is_system = is_system;
        this.gdrive_link = gdrive_link;
        this.groups = groups;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    freeze() {
        this.frozen = true;
    }

    unfreeze() {
        this.frozen = false;
    }
}
