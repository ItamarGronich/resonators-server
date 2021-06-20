import cfg from "../../../cfg";
import sendEmail from "../../../mailing";
import renderResonatorEmail from "./renderer";
import { schedulerLogger as log } from "../../../logging";

export default function sendResonatorMail(sentResonator, resonator, follower, leader, clinic) {
    if (follower.unsubscribed) {
        return Promise.resolve();
    }

    const html = renderResonatorEmail({
        resonator,
        leader,
        clinic,
        host: cfg.host,
        recipientUser: follower,
        sentResonatorId: sentResonator.id,
    });

    const msg = {
        to: follower.email,
        from: "mindharmoniesinc app",
        subject: resonator.title,
        html,
    };

    const sendCopyToLeader = !resonator.disable_copy_to_leader;
    if (sendCopyToLeader) msg.cc = leader.email;

    log.info(`Sending email for resonator ${resonator.id} to ${msg.to}`, {
        leader: `${leader.name} | ${leader.email}`,
        "leader copy": sendCopyToLeader,
    });

    return sendEmail(msg);
}
