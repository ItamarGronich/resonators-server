import { generateAuthUrl, requestAccessToken } from "../../google/oauth";
import googleAccountsRepository from "../../db/repositories/GoogleAccountRepository";
import userRepository from "../../db/repositories/UserRepository";
import addGoogleAccount from "./addGoogleAccount";
import fetchBasicGoogleDetails from "../../google/fetchBasicDetails";
import { registerUser } from "../registerUser";
import { loginByUserEntity } from "../login";
import getUow from "../getUow";
import cfg from "../../cfg";
import log from "../../logging";

const { loginRedirectUrl } = cfg.google;

export async function getLoginUrl() {
    let url = generateAuthUrl(loginRedirectUrl);
    url += "&prompt=consent";
    return url;
}

export async function loginGoogleUser(googleAuthCode) {
    try {
        log.info("Fetching access tokens for Google account");
        const tokens = await requestAccessToken(loginRedirectUrl, googleAuthCode);

        log.info("Fetching Google account basic details");
        const googleDetails = await fetchBasicGoogleDetails(tokens);

        let existingGoogleUserAccount = await googleAccountsRepository.findByEmail(googleDetails.email);

        let loginResult;

        if (existingGoogleUserAccount) {
            const user = await userRepository.findByPk(existingGoogleUserAccount.user_id);
            loginResult = await loginByUserEntity(user);
            log.info("Updating existing Google account");
            updateGoogleAccount(existingGoogleUserAccount, tokens);
            await getUow().commit();
        } else {
            log.info("Registering new Google account")
            loginResult = await registerGoogleUser(tokens, googleDetails);
        }

        return loginResult;
    } catch (err) {
        log.error("Google login failed! redirecting back to homepage", err);
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

    const { name, email } = googleDetails;
    const registerUserRequest = { name, email, password: tokens.refresh_token };

    const loginResult = await registerUser(registerUserRequest);

    await addGoogleAccount({
        ...tokens,
        user_id: loginResult.user_id,
        google_email: email,
    });

    await uow.commit();
    return loginResult;
}

function updateGoogleAccount(account, { access_token, refresh_token, expiry_date }) {
    account.access_token = access_token;
    account.refresh_token = refresh_token;
    account.access_token_expiry_date = expiry_date;
}
