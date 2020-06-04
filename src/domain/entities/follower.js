import uuid from 'uuid/v4';

export default class Follower {
    constructor({
        id,
        user,
        user_id,
        leader_id,
        clinic_id,
        status,
        frozen,
        created_at,
        updated_at
    }) {
        this.id = id || uuid();
        this.user_id = user_id;
        this.user = user;
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
