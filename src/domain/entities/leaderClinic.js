export default class LeaderClinic {
    constructor({
        leader_id,
        clinic_id,
        isPrimary,
        isLeaderAccepted
    }) {
        this.leader_id = leader_id;
        this.clinic_id = clinic_id;
        this.isPrimary = isPrimary;
        this.isLeaderAccepted = isLeaderAccepted;
    }
}
