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
    return createSentResonator(resonator)
        .then((sentResonator) => notifyFollower({ sentResonator, resonator, followerUser, leaderUser }))
        .then(() => setResonatorLastSentTime(resonator))
        .then(() => disableResonatorForSendOneOff(resonator));
}

function notifyFollower({ resonator, sentResonator, followerUser, leaderUser }) {
    log.info(`Sending new resonator ${sentResonator.id} for template resonator ${resonator.id}`);
    return Promise.all([
        sendResonatorMail(sentResonator, resonator, followerUser, leaderUser),
        sendResonatorNotification(sentResonator, resonator, followerUser),
    ]);
}

function createSentResonator(resonator) {
    return sent_resonators.create({
        id: uuid(),
        failed: false,
        resonator_id: resonator.id,
        // expiry_date: computeExpiry(resonator.ttl_policy),
    });
}

function setResonatorLastSentTime(resonator) {
    return resonators.update(
        {
            last_pop_time: new Date(),
        },
        {
            where: {
                id: resonator.id,
            },
        }
    );
}

function disableResonatorForSendOneOff(resonator) {
    if (resonator.one_off) {
        return resonators.update(
            {
                pop_email: false,
            },
            {
                where: {
                    id: resonator.id,
                },
            }
        );
    }
}

function computeExpiry(ttl) {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + ttl * 60 * 60 * 1000);
    return expiryDate;
}
