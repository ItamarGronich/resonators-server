import cfg from "../../../cfg";
import sendEmail from "../../../mailing";
import renderResonatorEmail from "./renderer";
import { schedulerLogger as log } from "../../../logging";
import LeaderClinicsRepository from "../../../db/repositories/LeaderClinicsRepository";

export default async function sendResonatorMail(sentResonator, resonator, follower) {
    if (follower.unsubscribed) {
        return Promise.resolve();
    }
    const { leader, clinic} = await LeaderClinicsRepository.getLeaderAndClinicByLeaderId(resonator.leader_id);

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
    if (sendCopyToLeader) msg.cc = leader.dataValues.email;

    log.info(`Sending email for resonator ${resonator.id} to ${msg.to}`, {
        leader: `${leader.dataValues.name} | ${leader.dataValues.email}`,
        "leader copy": sendCopyToLeader,
    });

    return sendEmail(msg);
}
