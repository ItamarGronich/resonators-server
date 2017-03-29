import _ from 'lodash';
import fetchPendingResonators from './fetchPendingResonators';
import {resonators, resonator_attachments, followers, leaders, users, resonator_questions, questions, answers, sent_resonators} from '../db/sequelize/models';
import * as dbToDomain from '../db/dbToDomain';
import renderResonatorEmail from '../emailRenderer/index';
import sendResonatorEmail from './sendResonatorEmail';
import cfg from '../cfg';
import uuid from 'uuid/v4';
import {emailSchedulerLogger as log} from '../infra/log';

export default async function scheduleEmails(getNow) {
    log.info('[emailScheduler] fetching pending resonators');
    const resonatorIds = await fetchPendingResonators(getNow);
    log.info(`[emailScheduler] ${resonatorIds.length} pending resonators`);

    if (resonatorIds.length > 0) {
        const resonatorData = await getResonatorsData(resonatorIds);

        const emailPromises = _(resonatorData).map(({
            resonator,
            followerUser,
            leaderUser
        }) => {
            if (followerUser.unsubscribed)
                return Promise.resolve();

            return sendEmail({
                resonator,
                followerUser,
                leaderUser
            });
        }).value();

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
                model: leaders,
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
            const followerUser = dbToDomain.toUser(row.follower.user);
            const leaderUser = dbToDomain.toUser(row.leader.user);
            return {resonator, followerUser, leaderUser};
        });
    });

    return Promise.all(promises);
}

function sendEmail({resonator, followerUser, leaderUser}) {
    const to = 'ancap.forever.21@gmail.com'; //user.email;
    const cc = 'ancap.forever.leader@gmail.com'; //leaderUser.email

    return recordSentResonator(resonator.id)
        .then(row => {
            const sendCopyToLeader = !resonator.disable_copy_to_leader;
            log.info(`sending email for resonator: ${resonator.id}, to: ${to}, leader copy: ${sendCopyToLeader && cc}`);

            const sentResonatorId = row.get('id');

            const html = renderResonatorEmail({
                resonator,
                host: cfg.host,
                sentResonatorId,
                recipientUser: followerUser
            });

            const msg = {
                from: 'mindharmoniesinc app',
                to,
                subject: resonator.title,
                html
            };

            if (sendCopyToLeader)
                msg.cc = cc;

            return sendResonatorEmail(msg);
        })
        .then(() => setResonatorLastSentTime(resonator.id));
}

function recordSentResonator(resonator_id) {
    return sent_resonators.create({
        id: uuid(),
        resonator_id,
        failed: false
    });
}

function setResonatorLastSentTime(resonatorId) {
    return resonators.update({
        last_pop_time: new Date()
    }, {
        where: {
            id: resonatorId
        }
    });
}
