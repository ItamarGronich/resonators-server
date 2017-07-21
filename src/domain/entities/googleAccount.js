import uuid from 'uuid/v4';

export default class GoogleAccount {
    constructor({
        id,
        id_token,
        access_token,
        refresh_token,
        access_token_expiry_date,
        user_id,
        google_email
    }) {
        this.id = id;
        this.id_token = id_token;
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.access_token_expiry_date = access_token_expiry_date;
        this.user_id = user_id;
        this.google_email = google_email;

        if (!id) {
            this.init();
        }
    }

    init() {
        this.id = uuid();
    }

    getTokens() {
        return {
            access_token: this.access_token,
            refresh_token: this.refresh_token,
            access_token_expiry_date: this.access_token_expiry_date
        };
    }
}
