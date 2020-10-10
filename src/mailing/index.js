import nodemailer from "nodemailer";

import cfg from "../cfg";

export default function sendEmail({ from = "mindharmoniesinc app", to, cc, subject, html }) {
    if (process.env.ENV !== "production") {
        return Promise.resolve();
    }

    let transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: cfg.email.username,
            pass: cfg.email.password,
        },
    });

    let mailOptions = {
        to,
        from,
        subject,
        html,
    };

    if (cc) mailOptions.cc = cc;

    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (error) => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}
