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

    if (resonatorIds.length > 0) {
        const resonatorData = await getResonatorsData(resonatorIds);

        const emailPromises = _(resonatorData).map(({
            resonator,
            followerUser,
            follower,
            leaderUser
        }) => {
            if (followerUser.unsubscribed) {
                return Promise.resolve();
            }

            if (follower.frozen) {
                return Promise.resolve();
            }

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
            const follower = dbToDomain.toFollower(row.follower);
            const followerUser = dbToDomain.toUser(row.follower.user);
            const leaderUser = dbToDomain.toUser(row.leader.user);
            return {resonator, follower, followerUser, leaderUser};
        });
    });

    return Promise.all(promises);
}

function sendEmail({resonator, followerUser, leaderUser}) {
    return recordSentResonator(resonator.id)
        .then(row => {
            const sentResonatorId = row.get('id');

            const html = renderResonatorEmail({
                resonator,
                host: cfg.host,
                sentResonatorId,
                recipientUser: followerUser
            });

            const msg = {
                from: 'mindharmoniesinc app',
                to: followerUser.email,
                subject: resonator.title,
                html
            };

            const sendCopyToLeader = !resonator.disable_copy_to_leader;

            if (sendCopyToLeader)
                msg.cc = leaderUser.email;

            log.info(`sending email for resonator: ${resonator.id}, to: ${msg.to}, leader copy: ${sendCopyToLeader && msg.cc}`);

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
