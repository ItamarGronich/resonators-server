import {generateAuthUrl, requestAccessToken} from '../../google/oauth';
import googleAccountsRepository from '../../db/repositories/GoogleAccountRepository';
import userRepository from '../../db/repositories/UserRepository';
import addGoogleAccount from './addGoogleAccount';
import fetchBasicGoogleDetails from '../../google/fetchBasicDetails';
import {registerUser} from '../registerUser';
import {loginByUserEntity} from '../login';
import getUow from '../getUow';
import cfg from '../../cfg';
import log from '../../logging';

const {loginRedirectUrl} = cfg.google;

export async function getLoginUrl() {
    let url = generateAuthUrl(loginRedirectUrl);
    url += '&prompt=consent';
    return url;
}

export async function loginGoogleUser(googleAuthCode) {
    try {
        log.info('[loginGoogleUser] requestAccessToken');
        const tokens = await requestAccessToken(loginRedirectUrl, googleAuthCode);

        log.info('[registerGoogleUser] fetchBasicGoogleDetails');
        const googleDetails = await fetchBasicGoogleDetails(tokens);

        let existingGoogleUserAccount = await googleAccountsRepository.findByEmail(googleDetails.email);

        let loginResult;

        if (existingGoogleUserAccount) {
            const user = await userRepository.findByPk(existingGoogleUserAccount.user_id);
            loginResult = await loginByUserEntity(user);
            updateGoogleAccount(existingGoogleUserAccount, tokens);
            log.info('[loginGoogleUser] updating existing google account');
            await getUow().commit();
        } else {
            loginResult = await registerGoogleUser(tokens, googleDetails);
        }

        return loginResult;
    } catch (err) {
        log.error('google login failed, redirecting back to homepage', err);
        return {};
    }
}

async function registerGoogleUser(tokens, googleDetails) {
    // tokens === {
    //     access_token,
    //     id_token,
    //     refresh_token,
    //     expiry_date //timestamp
    // }
    const uow = getUow();

    const {name, email} = googleDetails;

    const registerUserRequest =  {name, email, password: tokens.refresh_token};
    log.info('[registerGoogleUser] registerUser');
    const loginResult = await registerUser(registerUserRequest);

    const {user_id} = loginResult;

    log.info('[registerGoogleUser] addGoogleAccount');
    await addGoogleAccount({
        ...tokens,
        user_id,
        google_email: email
    });

    log.info('[registerGoogleUser] commit');
    await uow.commit();

    log.info('[registerGoogleUser] done successfully');
    return loginResult;
}

function updateGoogleAccount(account, {access_token, refresh_token, expiry_date}) {
    account.access_token = access_token;
    account.refresh_token = refresh_token;
    account.access_token_expiry_date = expiry_date;
}
