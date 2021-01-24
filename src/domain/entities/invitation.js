import { v4 as uuid } from "uuid";

export default class Invitation {
    constructor({
                    id,
                    user_id,
                    subject,
                    body,
                    createdAt,
                    updatedAt
                }) {
        this.id = id || uuid();
        this.user_id = user_id;
        this.subject = subject;
        this.body = body;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
