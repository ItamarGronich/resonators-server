import bcrypt from 'bcrypt';

export default class User {
    constructor({
        name,
        email,
        country,
        unsubscribed,
        pass,
        salt
    }) {
        this.name = name;
        this.email = email;
        this.country = country;
        this.unsubscribed = unsubscribed;
        this.pass = pass;
        this.salt = salt;
    }

    passwordsMatch(pass) {
        return this.pass === bcrypt.hashSync(pass, this.salt);
    }
}
