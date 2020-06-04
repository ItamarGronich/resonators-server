import GoogleAccount from '../../domain/entities/googleAccount';
import getUow from '../getUow';

export default async function addGoogleAccount({
    user_id,
    id_token,
    access_token,
    refresh_token,
    expiry_date,
    google_email
}) {
    const uow = getUow();

    const googleAccount = new GoogleAccount({
        user_id,
        id_token,
        access_token,
        refresh_token,
        access_token_expiry_date: expiry_date,
        google_email
    });

    uow.trackEntity(googleAccount, {isNew: true});

    return googleAccount;
}
