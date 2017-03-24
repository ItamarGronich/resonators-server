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
            if (!resonator) return Promise.resolve();

            const followerEmailPromise = sendEmail({resonator, user: followerUser});

            const leaderEmailPromise = !resonator.disable_copy_to_leader ?
                sendEmail({resonator, user: leaderUser}) : Promise.resolve();

            return [
                followerEmailPromise,
                leaderEmailPromise
            ];
        }).flatten().value();

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
                include: [{
                    model: users,
                    required: true
                }]
            }, {
                model: leaders,
                include: [{
                    model: users,
                    required: true
                }]
            }, {
                model: resonator_questions,
                include: [{
                    model: questions,
                    include: [answers]
                }]
            }]
        }).then(row => {
            if (!row) return {};

            const resonator = dbToDomain.toResonator(row);
            const followerUser = dbToDomain.toUser(row.follower.user);
            const leaderUser = dbToDomain.toUser(row.leader.user);
            return {resonator, followerUser, leaderUser};
        });
    });

    return Promise.all(promises);
}

function sendEmail({resonator, user}) {
    log.info(`sending email for resonator: ${resonator.id}`);
    return recordSentResonator(resonator.id)
        .then(row => {
            const sentResonatorId = row.get('id');
            const html = renderResonatorEmail({resonator, host: cfg.host, sentResonatorId});
            const from = 'mindharmoniesinc app';
            const to = 'ancap.forever.21@gmail.com';
            const subject = resonator.title;
            return sendResonatorEmail({from, to, subject, html});
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
