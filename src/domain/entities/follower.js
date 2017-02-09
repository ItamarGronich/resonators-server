export default class Follower {
    constructor({
        id,
        user_id,
        leader_id,
        clinic_id,
        status,
        created_at,
        updated_at
    }) {
        this.id = id;
        this.user_id = user_id;
        this.leader_id = leader_id;
        this.clinic_id = clinic_id;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
