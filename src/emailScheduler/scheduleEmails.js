import fetchPendingResonators from './fetchPendingEmails';
import {resonators, resonator_attachments, followers, users, resonator_questions, questions, answers} from '../db/sequelize/models';
import * as dbToDomain from '../db/dbToDomain';
import renderResonatorEmail from '../emailRenderer/index';
import sendResonatorEmail from './sendResonatorEmail';
import cfg from '../cfg';

export default async function scheduleEmails(getNow) {
    console.log('[emailScheduler] fetching pending resonators');
    const resonatorIds = await fetchPendingResonators(getNow);
    console.log(`[emailScheduler] ${resonatorIds.length} pending resonators`);

    if (resonatorIds.length > 0) {
        const resonatorData = await getResonatorsData(resonatorIds);
        const emailPromises = resonatorData.map(sendEmail);
        return Promise.all(emailPromises);
    } else {
        return Promise.resolve();
    }
}

function getResonatorsData(resonatorIds) {
    const promises = resonatorIds.map(id => {
        return resonators.findOne({
            where: {
                id
            },
            include: [
                resonator_attachments, {
                model: followers,
                include: [users]
            }, {
                model: resonator_questions,
                include: [{
                    model: questions,
                    include: [answers]
                }]
            }]
        }).then(row => {
            const resonator = dbToDomain.toResonator(row);
            const user = dbToDomain.toUser(row.follower.user);
            return {resonator, user};
        });
    });

    return Promise.all(promises);
}

function sendEmail({resonator, user}) {
    const html = renderResonatorEmail(resonator, cfg.host);
    const from = 'mindharmoniesinc app';
    const to = user.email;
    const subject = resonator.title;
    return sendResonatorEmail({from, to, subject, html});
}
