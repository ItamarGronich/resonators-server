import google from 'googleapis';
import secrets from '../../cfg/secrets'
import log from '../../infra/log';

const fs = require('fs');
const readline = require('readline');
const path = require('path');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = __dirname + '/cfg/token.json';
const DRIVE_CREDENTIAL_PATH = __dirname + '/cfg/credentials.json';

var gDriveOAuth = null;
authenticateGDrive((oAuth) => {

  console.log('--- Authenticated with google drive. ---');

  gDriveOAuth = oAuth;

  //test case
  {
    //copy();

    async function copy() {
      const targetId = await getRemoteBaseHierarchy('Target/Holder/test1', true);
      console.log('target Id :' + targetId);
      const fileId = await copyFile('1qN3DvgvxQtS4h9oNldJFCgkMGRUuWAUKbkLPP171cUg', 'TestFile2', targetId);
      const fileInfo = await getFileInfo(fileId);
      console.log('File Name: ', fileInfo.name);
    };

    // getInfo();

    async function getInfo() {
      const fId = await getFileIdInPath('TestDrive/Template/Template Doc')
      console.log('ID: ', fId);
      const fileInfo1 = await getFileInfo(fId);
      console.log('Filefid Name: ', fileInfo1.name);
    }

  }
})


function authenticateGDrive(callback) {
  // Load client secrets from a local file.
  fs.readFile(DRIVE_CREDENTIAL_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    return authorize(JSON.parse(content), callback);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err)
      return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

//---------------------------------------------------------
const FOLDER_MIME = "application/vnd.google-apps.folder";
//---------------------------------------------------------

async function getRemoteBaseHierarchy(remoteFolderPath, createFolder) {
  return new Promise((resolve, reject) => {

    var drive = google.drive({ version: 'v3', auth: gDriveOAuth });

    var folderSegments = remoteFolderPath.split('/');

    return createSingleRemoteFolder('');

    function createSingleRemoteFolder(parentId) {
      var remoteFolderName = folderSegments.shift();

      if (remoteFolderName === undefined) {
        // done processing folder segments - start the folder syncing job
        resolve(parentId);
      }
      else {
        var query = "(mimeType='" + FOLDER_MIME +
          "') and (trashed=false) and (name='"
          + remoteFolderName + "')";
        if (parentId !== '')
          query = query + " and ('" + parentId + "' in parents)";

        drive.files.list({
          pageSize: 1,
          q: query,
          fields: 'files(id,name,parents),nextPageToken'
        }, function (err, response) {
          if (err) { console.log('The API returned an error : ' + err); return; }
          // console.log('response' + response);

          if (response.files.length === 1) {
            // folder segment already exists, keep going down...
            var folderId = response.files[0].id;
            // console.log(folderId);

            return createSingleRemoteFolder(folderId);
          } else if (createFolder) {
            // folder segment does not exist, create the remote folder and keep going down...
            drive.files.create({
              resource: {
                name: remoteFolderName,
                parents: [parentId],
                mimeType: FOLDER_MIME
              }
            }, function (err, response) {
              if (err) { console.log('The API returned an error : ' + err); return; }
              // console.log('response2' + response);

              var folderId = response.id;
              console.log('+ /%s', remoteFolderName);
              return createSingleRemoteFolder(folderId);
            });
          }
          else { reject(); }

        });
      }
    };
  });
}
//---------------------------------------------------------

async function copyFile(fileId, fileName, parentId) {
  return new Promise((resolve, reject) => {
    var drive = google.drive({ version: 'v3', auth: gDriveOAuth });

    var fileMetadata = {
      'name': fileName,
      'parents': [parentId]
    };
    drive.files.copy({
      resource: fileMetadata,
      fileId: fileId,
      fields: 'id, parents'
    }, function (err, file) {
      if (err) {
        // Handle error
        // console.error(err);
        reject(err);
      } else {
        // console.log('File Id: ', file.id);
        resolve(file.id);
      }
    });
  });
}
//---------------------------------------------------------

async function getFileInfo(infileId) {
  return new Promise((resolve, reject) => {
    var drive = google.drive({ version: 'v3', auth: gDriveOAuth });
    // console.log(infileId);

    drive.files.get({
      fileId: infileId,
      fields: 'id, name, parents'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
        reject(err);
      } else {
        // console.log('File Name: ', file.name);
        resolve(file);
      }
    });
  });
}
//---------------------------------------------------------

async function getFileId(fileName, parentId) {
  return new Promise((resolve, reject) => {

    var drive = google.drive({ version: 'v3', auth: gDriveOAuth });

    var query = "(trashed=false) and (name='" + fileName + "')";
    if (parentId !== '')
      query = query + " and ('" + parentId + "' in parents)";

    drive.files.list({
      pageSize: 1,
      q: query,
      fields: 'files(id,name,parents)'
    }, function (err, response) {
      if (err) {
        // Handle error
        console.error(err);
        reject(err);
      } else if (response.files.length === 1) {

        var fileId = response.files[0].id;
        // console.log(fileId);
        resolve(fileId);
      }
      else {
        reject(err);
      }
    });
  });
}
//---------------------------------------------------------

async function getFileIdInPath(filePath) {

  const basePath = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const folderId = await getRemoteBaseHierarchy(basePath, false);
  if (folderId !== undefined) {
    // console.log('Folder Id :' + folderId);
    const fileId = await getFileId(fileName, folderId);
    // console.log('File Id :' + fileId);

    return fileId;
  }
}
//---------------------------------------------------------
//---------------------------------------------------------
