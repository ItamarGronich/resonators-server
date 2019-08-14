import google from 'googleapis';

//load credentials some how...
let creds = null;
let token = null;

try {
  creds = require("./../drive/cfg/credentials.json");
  token = require("./../drive/cfg/token.json");
} catch (err) {
  throw `Failed to load credentials.json: ${err}`;
}
if (creds.refresh_token === "...") {
  throw `Please run 'node credentials-fill.js'`;
}

//prepare oauth2 client
const auth = new google.auth.OAuth2(
  creds.installed.client_id,
  creds.installed.client_secret,
  creds.installed.redirect_uris[0]
);
auth.setCredentials({
  access_token: token.access_token,
  expiry_date: token.expiry_date,
  refresh_token: token.refresh_token,
  token_type: token.token_type
});

module.exports = auth;
