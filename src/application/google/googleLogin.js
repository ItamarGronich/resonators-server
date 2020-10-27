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
import { checkLeaderGroupPermissions } from "../leaderFollowerGroups";
import {followers, leaders} from "../../db/sequelize/models";
import { hasRelation } from '../../application/utils';

const { loginRedirectUrl } = cfg.google;

export async function getLoginUrl(isLeader) {
    const state = {isLeader: isLeader};
    let url = generateAuthUrl(loginRedirectUrl, state);
    url += "&prompt=consent";
    return url;
}

export async function loginGoogleUser(googleAuthCode, state) {
    try {
        log.info("Fetching access tokens for Google account");
        const tokens = await requestAccessToken(loginRedirectUrl, googleAuthCode);

        log.info("Fetching Google account basic details");
        const googleDetails = await fetchBasicGoogleDetails(tokens);

        let existingGoogleUserAccount = await googleAccountsRepository.findByEmail(googleDetails.email);

        let loginResult;

        if (existingGoogleUserAccount) {
            const user = await userRepository.findByPk(existingGoogleUserAccount.user_id);

            try {
                await checkLeaderGroupPermissions(user);
            } catch (e) {
                log.error(`Could not verify leader's permissions`, e);
            }

            if (state.isLeader) {
                if (!await hasRelation(leaders, user, 'user_id')) {
                    log.error("User is not a leader");
                    return {error: 'not_leader'};
                }
            } else {
                if (!await hasRelation(followers, user, 'user_id')) {
                    log.error("User is not a follower");
                    return {error: 'not_follower'};
                }
            }

            loginResult = await loginByUserEntity(user);
            log.info("Updating existing Google account");
            updateGoogleAccount(existingGoogleUserAccount, tokens);
            await getUow().commit();
        } else {
            const user = await userRepository.findByEmail(googleDetails.email);
            if (user) { // User exists but doesn't have a Google User record yet
                await addGoogleAccount({
                    ...tokens,
                    user_id: user.id,
                    google_email: googleDetails.email,
                });
                loginResult = await loginByUserEntity(user);
                await getUow().commit();
            } else if (state.isLeader === false) { // User doesn't exist and tries to register as a follower
                log.error("Can't register as a follower. Follower needs to be assigned to a leader");
                return {error: 'follower_registration_not_allowed'};
            } else {
                log.info("Registering new Google account");
                loginResult = await registerGoogleUser(tokens, googleDetails);
            }
        }

        return loginResult;
    } catch (err) {
        log.error("Google login failed! redirecting back to homepage", err);
        return {error: 'unknown'};
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
