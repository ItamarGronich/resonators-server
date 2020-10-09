import webpush from "web-push";

import cfg from "../../cfg";
import { push_subscriptions } from "../../db/sequelize/models";

let vapid_keys_set = false;

export function sendResonatorNotification(sentResonator, resonator, user) {
    ensureVapidKeys();
    return sendPushNotification(user, {
        type: "resonator",
        title: "New Resonator",
        options: {
            id: sentResonator.id,
            image: resonator.getImage(),
            body: "You have been sent a new resonator",
        },
    });
}

async function sendPushNotification(user, payload) {
    const subscriptions = await getUserSubscriptions(user);
    return Promise.all(subscriptions.map(dispatchNotification(JSON.stringify(payload))));
}

function dispatchNotification(payload) {
    return (subscription) =>
        webpush
            .sendNotification(subscription, payload)
            .then(() => setLastSent(subscription))
            .catch(deleteExpired(subscription));
}

async function getUserSubscriptions(user) {
    return await push_subscriptions.findAll({
        where: {
            userId: user.id,
        },
    });
}

async function setLastSent(subscription) {
    return await subscription.update({
        last_sent: new Date(),
    });
}

function deleteExpired(subscription) {
    return async (response) => {
        if (response.statusCode === 410) {
            await subscription.destroy();
        }
        throw response;
    };
}

function ensureVapidKeys() {
    if (!vapid_keys_set) {
        setVapidKeys();
        vapid_keys_set = true;
    }
}

function setVapidKeys() {
    webpush.setVapidDetails(`mailto:${cfg.supportMail}`, cfg.vapid.publicKey, cfg.vapid.privateKey);
}
