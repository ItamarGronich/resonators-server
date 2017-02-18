import React from 'react';
import ResonatorEmail from './ResonatorEmail';
import Oy from 'oy-vey';

export default function renderResonatorEmail(resonator) {
    const template = Oy.renderTemplate(<ResonatorEmail resonator={resonator}/>, {
        title: resonator.title,
        previewText: resonator.title
    });

    return template;
}
