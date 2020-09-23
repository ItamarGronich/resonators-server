import * as uuid from 'uuid';

export default class FollowerGroup {
    constructor({
        id,
        group_name,
        leader_id,
        clinic_id,
        status,
        frozen,
        created_at,
        updated_at
    }) {
        this.id = id || uuid.v4();
        this.group_name = group_name;
        this.leader_id = leader_id;
        this.clinic_id = clinic_id;
        this.status = status;
        this.frozen = frozen;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    freeze() {
        this.frozen = true;
    }

    unfreeze() {
        this.frozen = false;
    }
}
