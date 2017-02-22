import nodemailer from 'nodemailer';
import cfg from '../cfg';

export default function sendResonatorEmail({from, to, subject, html}) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: cfg.email.username,
            pass: cfg.email.password
        }
    });

    let mailOptions = {
        from,
        to,
        subject,
        html
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }

            resolve();
        });
    });
}
