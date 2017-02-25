import React from 'react';
import ResonatorEmail from './ResonatorEmail';
import Oy from 'oy-vey';

export default function renderResonatorEmail({resonator, sentResonatorId, host, preview = false}) {
    const template = Oy.renderTemplate(
        <ResonatorEmail
            resonator={resonator}
            sentResonatorId={sentResonatorId}
            host={host}
            preview={preview}
        />, {
        title: resonator.title,
        previewText: resonator.title
    });

    return template;
}
