import _ from 'lodash';
import Oy from 'oy-vey';
import React from 'react';

import ResonatorEmail from './ResonatorEmail';

export default function renderResonatorEmail({resonator, leader, clinic, recipientUser, sentResonatorId, host, preview = false}) {
    const dir = getBodyDir(resonator);

    const template = Oy.renderTemplate(
        <ResonatorEmail
            resonator={resonator}
            sentResonatorId={sentResonatorId}
            leader={leader}
            clinic={clinic}
            host={host}
            preview={preview}
            recipientUser={recipientUser}
        />, {
        title: resonator.title,
        previewText: resonator.title,
        dir
    });

    return template;
}

function getBodyDir(resonator) {
    const text = (resonator.content + resonator.description) || '';
    const textArr = text.split('');
    const hebrewLettersCount = _.reduce(textArr, (acc, letter) => {
        return acc + (isHebrewLetter(letter) ? 1 : 0);
    }, 0);

    const isHebrew = hebrewLettersCount / textArr.length > 0.5;
    return isHebrew ? 'rtl' : 'ltr';
}

function isHebrewLetter(letter) {
    const code = letter.charCodeAt(0);
    return code === 32 || code >= 1488 && code <= 1514;
}
