export default class Leader {
    constructor({
        id,
        user_id,
        title,
        description,
        current_clinic_id,
        visible,
        group_permissions,
        admin_permissions
    }) {
        this.id = id;
        this.user_id = user_id;
        this.title = title;
        this.description = description;
        this.visible = visible;
        this.current_clinic_id = current_clinic_id;
        this.group_permissions = group_permissions;
        this.admin_permissions = admin_permissions;
    }
}
