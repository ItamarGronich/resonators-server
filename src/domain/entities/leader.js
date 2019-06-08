export default class Leader {
    constructor({
        id,
        user_id,
        title,
        description,
        current_clinic_id,
        visible
    }) {
        this.id = id;
        this.user_id = user_id;
        this.title = title;
        this.description = description;
        this.visible = visible;
        this.current_clinic_id = current_clinic_id;
    }
}
