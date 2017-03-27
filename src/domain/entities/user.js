import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

        if (!id) {
            const validationResult = this.validate({email, name, password: pass});

            if (validationResult && validationResult.error)
                return validationResult;

            this.init(pass);
        }
    }

    init(pass) {
        this.id = uuid();
        this.setHashedPassword(pass);
    }

    setHashedPassword(pass) {
        this.salt = bcrypt.genSaltSync(10);
        this.pass = bcrypt.hashSync(pass, this.salt);
    }

    changePassword(pass) {
        this.setHashedPassword(pass);
    }

    validate({email, name, password}) {
        if (!emailRegex.test(email)) {
            return {
                isValid: false,
                error: 'invalid email'
            };
        }

        if (!name) {
            return {
                isValid: false,
                error: 'invalid name'
            }
        }

        if (!password) {
            return {
                isValid: false,
                error: 'invalid password'
            }
        }

        return null;
    }

    passwordsMatch(pass) {
        return this.pass === bcrypt.hashSync(pass, this.salt);
    }

    unsubscribe() {
        this.unsubscribed = true;
    }
}
