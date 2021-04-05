import { v4 as uuid } from "uuid";

export default class GoogleContact {
    constructor({
                    id,
                    user_id,
                    name,
                    email
                }) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.email = email;

        if (!id)
            this.id = uuid();
    }
}
