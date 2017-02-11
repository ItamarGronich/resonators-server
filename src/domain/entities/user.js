import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';

export default class User {
    constructor({
        id,
        name,
        email,
        country,
        unsubscribed,
        pass,
        salt
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.country = country;
        this.unsubscribed = unsubscribed;
        this.pass = pass;
        this.salt = salt;

        if (!id)
            this.init(pass);
    }

    init(pass) {
        this.id = uuid();
        this.salt = bcrypt.genSaltSync(10);
        this.pass = bcrypt.hashSync(pass, this.salt);
    }

    passwordsMatch(pass) {
        return this.pass === bcrypt.hashSync(pass, this.salt);
    }
}
