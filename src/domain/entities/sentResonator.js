export default class SentResonator {
    constructor({
        id,
        resonator_id,
        expiry_date,
        created_at,
        updated_at
    }) {
        this.id = id;
        this.resonator_id = resonator_id;
        this.expiry_date = expiry_date;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
