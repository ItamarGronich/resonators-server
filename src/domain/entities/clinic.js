export default class Clinic {
    constructor({
        id,
        user_id,
        name,
        email,
        logo,
        phone,
        website,
        qr
    }) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.email = email;
        this.logo = logo;
        this.phone = phone;
        this.website = website;
        this.qr = qr;
    }
}
