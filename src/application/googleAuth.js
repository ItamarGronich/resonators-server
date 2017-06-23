import {generateAuthUrl, requestAccessToken} from '../google/oauth';
import googleAccountsRepository from '../db/repositories/GoogleAccountRepository';
import GoogleAccount from '../domain/entities/googleAccount';
import getUow from './getUow';

export async function startGoogleAuth(userId) {
    const hasGoogleAccount = !!await googleAccountsRepository.findByUserId(userId);

    let url = generateAuthUrl({userId});

    if (!hasGoogleAccount)
        url += '&prompt=consent';

    return url;
}

export async function endGoogleAuth(user_id, gooleAuthCode) {
    const tokens = await requestAccessToken(gooleAuthCode);

    const {
        access_token,
        id_token,
        refresh_token,
        expiry_date //timestamp
    } = tokens;

    let googleAccount = await googleAccountsRepository.findByUserId(user_id);

    const uow = getUow();

    if (!googleAccount) {
        googleAccount = new GoogleAccount({
            user_id,
            id_token,
            access_token,
            refresh_token,
            access_token_expiry_date: expiry_date
        });

        uow.trackEntity(googleAccount, {isNew: true});
    } else {
        googleAccount.id_token = id_token;
        googleAccount.access_token = access_token;
        googleAccount.refresh_token = refresh_token;
        googleAccount.expiry_date = expiry_date;
    }

    await uow.commit();
}
