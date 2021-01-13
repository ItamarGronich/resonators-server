import { v4 as uuid } from "uuid";

import { schedulerLogger as logger } from "../logging";
import { resonators, sent_resonators } from "../db/sequelize/models";
import { fetchPendingResonators, fetchResonatorData } from "./queries";
import { sendResonatorMail, sendResonatorNotification } from "./channels";

export default async function scheduleResonators() {
    logger.info("Fetching pending resonators");
    const resonatorIds = await fetchPendingResonators();
    logger.info(`Found ${resonatorIds.length} resonators to be sent`);
    return Promise.all(resonatorIds.map((id) => fetchResonatorData(id).then(sendNewResonator)));
}

function sendNewResonator({ resonator, followerUser, leaderUser }) {
    return createSentResonator(resonator)
        .then((sentResonator) => notifyFollower({ sentResonator, resonator, followerUser, leaderUser }))
        .then(() => setResonatorLastSentTime(resonator))
        .then(() => disableResonatorForSendOneOff(resonator));
}

function createSentResonator(resonator) {
    return sent_resonators.create({
        id: uuid(),
        failed: false,
        resonator_id: resonator.id,
        read: false,
        // expiry_date: computeExpiry(resonator.ttl_policy),
    });
}

function notifyFollower({ resonator, sentResonator, followerUser, leaderUser }) {
    logger.info(`Sending new resonator ${sentResonator.id} for template resonator ${resonator.id}`);
    return Promise.all([
        sendResonatorMail(sentResonator, resonator, followerUser, leaderUser),
        sendResonatorNotification(sentResonator, resonator, followerUser),
    ]);
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
        logger.info(`Deactivating one-off resonator ${resonator.id}`)
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
