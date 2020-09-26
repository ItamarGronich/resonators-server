export default class LeaderClinic {
    constructor({
        id,
        leader_id,
        clinic_id,
        is_primary,
        is_leader_accepted
    }) {
        this.id = id;
        this.leader_id = leader_id;
        this.clinic_id = clinic_id;
        this.is_primary = is_primary;
        this.is_leader_accepted = is_leader_accepted;
    }
}