import { v4 as uuid } from "uuid";

export default class GooglePhoto {
    constructor({
                    id,
                    user_id,
                    image,
                    description,
                    file_id
                }) {
        this.id = id;
        this.user_id = user_id;
        this.image = image;
        this.description = description;
        this.file_id = file_id;

        if (!id)
            this.id = uuid();
    }
}
