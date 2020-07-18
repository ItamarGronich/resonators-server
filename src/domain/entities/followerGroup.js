import uuid from 'uuid/v4';

export default class FollowerGroup {
    constructor({
        id,
        group_name,
        leader_id,
        clinic_id,
        status,
        created_at,
        updated_at
    }) {
        this.id = id || uuid();
        this.group_name = group_name;
        this.leader_id = leader_id;
        this.clinic_id = clinic_id;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
