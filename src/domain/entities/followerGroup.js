import { v4 as uuid } from 'uuid';

export default class FollowerGroup {
    constructor({
        id,
        group_name,
        leader_id,
        clinic_id,
        status,
        frozen,
        createdAt,
        updatedAt
    }) {
        this.id = id || uuid();
        this.group_name = group_name;
        this.leader_id = leader_id;
        this.clinic_id = clinic_id;
        this.status = status;
        this.frozen = frozen;
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
