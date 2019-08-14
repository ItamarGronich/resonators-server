import _ from 'lodash';
import resonatorRepository from '../db/repositories/ResonatorRepository';
import * as dtoFactory from './dto';
import getUow from './getUow';
import { getValues, updateAnswer } from './../google/sheets/googleSheetApi'


export async function getQuestionnaireData({ resonator_id }) {
    const [resonator] = await Promise.all([
        resonatorRepository.findById(resonator_id)
    ]);

    if (!resonator)
        return null;

    //Save to google sheet

    const sheet_id = '12Ljz-q61FriVfaZpfovlD_JFQ5q-Xpv5fNeMTIqOShE';// resonator.selected_questionnaire;

    const [questionnaire_data] = await Promise.all([
        getQuestionFromSheet(sheet_id)
    ]);

    await getUow().commit();

    const resonatorDto = dtoFactory.toResonator(resonator);

    return {
        resonator: resonatorDto,
        questionnaire: questionnaire_data
    };
}

export async function sendQuestionnaireAnswer({ resonator_id, question_id, answer }) {
    const [resonator] = await Promise.all([
        resonatorRepository.findById(resonator_id)
    ]);

    if (!resonator)
        return null;

    //Save to google sheet

    const sheet_id = '12Ljz-q61FriVfaZpfovlD_JFQ5q-Xpv5fNeMTIqOShE';// resonator.selected_questionnaire;

    await Promise.all([
        saveAswerToSheet(sheet_id, question_id, answer)
    ]);
    await getUow().commit();
    
    return true;
}


async function saveAswerToSheet(sheet_id, q_id, answer) {
    if (answer) {
        const row = Number(q_id);
        const range = `Questionnaire!C${row}`;
        const values = [[answer]];
        await updateAnswer({ sheet_id: sheet_id, range: range, values });
    }
}

async function getQuestionFromSheet(sheet_id) {
    const headRange = `Questionnaire!B1:E2`;
    const header = await getValues({ sheet_id: sheet_id, range: headRange });

    const startRow = header[1][2];
    const endRow = header[1][3];

    const start_row = Number(startRow);
    const last_row = Number(endRow);

    const range1 = `Questionnaire!A${start_row}:F${last_row}`;
    const values = await getValues({ sheet_id: sheet_id, range: range1 });

    const range3 = 'PullDownValues!A2:C5';
    const options = await getValues({ sheet_id: sheet_id, range: range3 });

    return { header: header, row_values: values, options: options };
}