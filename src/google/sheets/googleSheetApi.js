import _ from 'lodash';
import google from 'googleapis';
const auth = require("./credentials-load");
/*
async function run() {
  //create sheets client
  const sheets = google.sheets({ version: "v4", auth: auth });
  //get a range of values
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '12Ljz-q61FriVfaZpfovlD_JFQ5q-Xpv5fNeMTIqOShE',
    range: 'Questionnaire!b1:e3',
    auth: auth
  }, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }

    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(res, null, 2));
  });
  console.log('Done......');
}

run().catch(err => console.error("ERR", err));

async function runApp() {
  //create sheets client
  const sheets = google.sheets({ version: "v4", auth: auth });
  //get a range of values
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: '12Ljz-q61FriVfaZpfovlD_JFQ5q-Xpv5fNeMTIqOShE',
    range: "Sheet1!H8",
    valueInputOption: "RAW",
    resource: {
      values: [
        ["first row, first col"]
      ]
    }, auth: auth
  }, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }

    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(res, null, 2));
  });
  console.log('Done......');
}

runApp().catch(err => console.error("ERR", err));
*/

export async function getValues({ sheet_id, range }) {
  return new Promise((resolve) => {
    const sheets = google.sheets({ version: "v4", auth: auth });
    sheets.spreadsheets.values.get({
      spreadsheetId: sheet_id,
      range: range,
      auth: auth
    }, function (err, res) {
      if (err) {
        console.error(err);
        return resolve({});
      }
      resolve(res.values);
    });
  });
}

export async function getValuesInBatch({ sheet_id, ranges }) {
  return new Promise((resolve) => {
    const sheets = google.sheets({ version: "v4", auth: auth });
    sheets.spreadsheets.values.batchGet({
      spreadsheetId: sheet_id,
      ranges: ranges,
      auth: auth
    }, function (err, res) {
      if (err) {
        console.error(err);
        return resolve({});
      }
      resolve(res.values);
    });
  });
}

export async function updateAnswer({ sheet_id, range, values }) {
  return new Promise((resolve) => {
    const sheets = google.sheets({ version: "v4", auth: auth });
    sheets.spreadsheets.values.update({
      spreadsheetId: sheet_id,
      range: range,
      valueInputOption: "RAW",
      resource: {
        values: values
      }, auth: auth
    }, function (err, res) {
      if (err) {
        console.error(err);
        return resolve({});
      }
      resolve(res.updatedCells);
    });
  });
}