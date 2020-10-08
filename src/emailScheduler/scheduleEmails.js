import { v4 as uuid } from "uuid";

import cfg from "../cfg";
import * as dbToDomain from "../db/dbToDomain";
import renderResonatorEmail from "../emailRenderer";
import sendResonatorEmail from "./sendResonatorEmail";
import fetchPendingResonators from "./fetchPendingResonators";
import { emailSchedulerLogger as log } from "../logging";
import { sendResonatorNotification } from "./push";
import {
    resonators,
    resonator_attachments,
    followers,
    leaders,
    users,
    resonator_questions,
    questions,
    answers,
    sent_resonators,
} from "../db/sequelize/models";

export default async function scheduleEmails(getNow) {
    log.info("Fetching pending resonators");
    const resonatorIds = await fetchPendingResonators(getNow);
    log.info(`Found ${resonatorIds.length} resonators to be sent`);

    if (resonatorIds.length > 0) {
        const resonatorData = await getResonatorsData(resonatorIds);
        const emailPromises = resonatorData.map(sendNewResonator);
        return Promise.all(emailPromises);
    } else {
        return Promise.resolve();
    }
}

function getResonatorsData(resonatorIds) {
    const promises = resonatorIds.map((id) => {
        return resonators
            .findOne({
                where: {
                    id,
                },
                include: [
                    resonator_attachments,
                    {
                        model: followers,
                        include: [users],
                    },
                    {
                        model: leaders,
                        include: [users],
                    },
                    {
                        model: resonator_questions,
                        include: [
                            {
                                model: questions,
                                include: [answers],
                            },
                        ],
                    },
                ],
            })
            .then((row) => {
                const resonator = dbToDomain.toResonator(row);
                const followerUser = dbToDomain.toUser(row.follower.user);
                const leaderUser = dbToDomain.toUser(row.leader.user);
                return { resonator, followerUser, leaderUser };
            });
    });

    return Promise.all(promises);
}

function sendNewResonator({ resonator, followerUser, leaderUser }) {
    return recordSentResonator({ id: resonator.id })
        .then((sentResonator) => {
            sendMail(sentResonator.id, resonator, followerUser, leaderUser);
            sendResonatorNotification(sentResonator, resonator, followerUser);
        })
        .then(() => setResonatorLastSentTime(resonator.id))
        .then(() => {
            if (resonator.one_off) return disableResonatorForSendOneOff(resonator.id);
            else return;
        });
}

function sendMail(sentResonatorId, resonator, follower, leader) {
    if (follower.unsubscribed) {
        return Promise.resolve();
    }

    const html = renderResonatorEmail({
        resonator,
        host: cfg.host,
        sentResonatorId,
        recipientUser: follower,
    });

    const msg = {
        from: "mindharmoniesinc app",
        to: follower.email,
        subject: resonator.title,
        html,
    };

    const sendCopyToLeader = !resonator.disable_copy_to_leader;

    if (sendCopyToLeader) msg.cc = leader.email;

    log.info(`Sending email for resonator ${resonator.id} to ${msg.to}`, {
        leader: `${leader.name} | ${leader.email}`,
        "leader copy": sendCopyToLeader,
    });

    return sendResonatorEmail(msg);
}

function recordSentResonator({ id, ttl_policy }) {
    // const expiryDate = new Date();
    // expiryDate.setTime(expiryDate.getTime() + (ttl_policy * 60 * 60 * 1000));
    return sent_resonators.create({
        id: uuid(),
        resonator_id: id,
        // expiry_date: expiryDate,
        failed: false,
    });
}

function setResonatorLastSentTime(resonatorId) {
    return resonators.update(
        {
            last_pop_time: new Date(),
        },
        {
            where: {
                id: resonatorId,
            },
        }
    );
}

function disableResonatorForSendOneOff(resonatorId) {
    return resonators.update(
        {
            pop_email: false,
        },
        {
            where: {
                id: resonatorId,
            },
        }
    );
}
