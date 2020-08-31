import webpush from "web-push";

import cfg from "../cfg";
import { push_subscriptions } from "../db/sequelize/models";

export function sendResonatorNotification(sentResonator, resonator, user) {
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
            user_id: user.id,
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

export function setVapidKeys() {
    webpush.setVapidDetails(`mailto:${cfg.supportMail}`, cfg.vapid.publicKey, cfg.vapid.privateKey);
}
