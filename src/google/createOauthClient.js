import cfg from "../cfg";
import { google } from "googleapis";

export default function createOauthClient(oauthRedirectUrl) {
    return new google.auth.OAuth2(cfg.google.clientId, cfg.google.secret, oauthRedirectUrl);
}
