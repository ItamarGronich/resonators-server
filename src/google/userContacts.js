import dispatch from "./dispatcher";
import { google } from "googleapis";
import { v4 as uuid } from "uuid";
import GoogleContactRepository from '../db/repositories/GoogleContactRepository';

const people = google.people("v1");

export default async function storeUserContacts(tokens, user_id) {

    const params = {
        pageSize: 1000,
        readMask: "emailAddresses,names",
    };

    const contacts = await dispatch(people.otherContacts.list.bind(people.otherContacts), tokens, params);

    contacts.data.otherContacts.map(async (contact) => {
        const email = contact.emailAddresses?.shift().value;
        if (!email) return false;
        const name = contact.names?.shift().displayName;
        const existingContact = await GoogleContactRepository.getUserContactByEmail(user_id, email);

        GoogleContactRepository.createUserContact({
            id: existingContact?.id || uuid(),
            user_id,
            name,
            email
        });
    });

}
