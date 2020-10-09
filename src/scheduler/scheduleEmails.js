import { v4 as uuid } from "uuid";

import * as dbToDomain from "../db/dbToDomain";
import { schedulerLogger as log } from "../logging";
import fetchPendingResonators from "./fetchPendingResonators";
import { sendResonatorMail, sendResonatorNotification } from "./channels";
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
    return Promise.all(resonatorIds.map((id) => getResonatorData(id).then(sendNewResonator)));
}

function getResonatorData(resonatorId) {
    return resonators
        .findOne({
            where: {
                id: resonatorId,
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
}

function sendNewResonator({ resonator, followerUser, leaderUser }) {
    return recordSentResonator({ id: resonator.id })
        .then((sentResonator) => {
            log.info(`Sending new resonator ${sentResonator.id} for template resonator ${resonator.id}`);
            sendResonatorMail(sentResonator, resonator, followerUser, leaderUser);
            sendResonatorNotification(sentResonator, resonator, followerUser);
        })
        .then(() => setResonatorLastSentTime(resonator.id))
        .then(() => {
            if (resonator.one_off) return disableResonatorForSendOneOff(resonator.id);
            else return;
        });
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
