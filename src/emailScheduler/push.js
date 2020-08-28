import webpush from "web-push";

import cfg from "../cfg";
import { push_subscriptions } from "../db/sequelize/models";

export function sendResonatorNotification(sentResonator, resonator, user) {
    return sendPushNotification(user, {
        type: "resonator",
        title: "New Resonator",
        body: "You have been sent a new resonator",
        options: {
            id: sentResonator.id,
            image: resonator.getImage(),
        },
    });
}

async function sendPushNotification(user, payload) {
    const subscriptions = await getUserSubscriptions(user);
    return Promise.all(subscriptions.map(dispatchNotification(JSON.stringify(payload))));
}

function dispatchNotification(payload) {
    return (subscription) => webpush.sendNotification(subscription, payload);
}

async function getUserSubscriptions(user) {
    const subscriptions = await push_subscriptions.findAll({
        where: {
            user_id: user.id,
        },
    });
    return subscriptions.map((sub) => sub.subscription);
}

export function setVapidKeys() {
    webpush.setVapidDetails(`mailto:${cfg.supportMail}`, cfg.vapid.publicKey, cfg.vapid.privateKey);
}
