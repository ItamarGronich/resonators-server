import nodemailer from 'nodemailer';
import cfg from '../cfg';

export default function sendResonatorEmail({from = 'mindharmoniesinc app', to, cc, subject, html}) {
    if (process.env.ENV === 'test')
        return Promise.resolve();

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: cfg.email.username,
            pass: cfg.email.password
        }
    });

    to = to === 'dror.gronich@gmail.com' ? to : 'fake.email.4242@gmail.com';
    cc = cc === 'dror.gronich@gmail.com' ? cc : null;

    let mailOptions = {
        from,
        to,
        subject,
        html
    };

    if (cc)
        mailOptions.cc = cc;

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }

            resolve();
        });
    });
}
