import webpush from "web-push";

import cfg from "../cfg";
import { push_subscriptions } from "../db/sequelize/models";

export async function notifyUser(user, sentResonatorId, resonator) {
    const subscriptions = await getUserSubscriptions(user);
    return Promise.all(
        subscriptions.map((subscription) =>
            webpush.sendNotification(subscription, getNotificationPayload(sentResonatorId, resonator))
        )
    );
}

async function getUserSubscriptions(user) {
    const subscriptions = await push_subscriptions.findAll({
        where: {
            user_id: user.id,
        },
    });
    return subscriptions.map((subscription) => subscription.subscription);
}

function getNotificationPayload(sentResonatorId, resonator) {
    return JSON.stringify({
        type: "resonator",
        title: "New Resonator",
        body: "You have been sent a new resonator",
        options: {
            id: sentResonatorId,
            image: resonator.getImage(),
        },
    });
}

export function setVapidKeys() {
    webpush.setVapidDetails("mailto:bla@bla.com", cfg.vapid.publicKey, cfg.vapid.privateKey);
}
