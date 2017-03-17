export default class Leader {
    constructor({
        id,
        user_id,
        title,
        description,
        visible
    }) {
        this.id = id;
        this.user_id = user_id;
        this.title = title;
        this.description = description;
        this.visible = visible;
    }
}
