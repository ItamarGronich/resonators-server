import express from "../express"
import sendEmail from "../../mailing"
import routeHandler from "../routeHandler"
import axios from 'axios';
import cfg from "../../cfg";

express.post('/api/contactForm', routeHandler(async (request, response) => {

    const { name = '', country = '', phone = '', email = '', message = '', 'g-recaptcha-response': grecaptcharesponse } = request.body;

    const recaptchaSecretKey = cfg.googleCaptcha.secret;
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    
    if (!(email || phone)) {
        response.status(422);
        response.json({})
        return;
    }

    try {
        const result = await axios({
            method: 'post',
            url: googleVerifyUrl,
            params: {
                secret: recaptchaSecretKey,
                response: grecaptcharesponse
            }
        });

        const data = result.data;              

        if (!data.success) {
            response.json("Please verify captcha");
            return;
        }

    }
    catch (e) {
        response.status(500);
        response.json(e);
        return;
    }      
  
    try {
        await sendEmail({
            to: cfg.supportEmail.emailId,
            subject: 'User submitted contact form',
            html: `
                <table>
                      <thead>
                            <th>Contact Form Details</th>
                      </thead>
                      <tbody>
                            <tr>
                                <td>Name:</td><td>${name}</td>
                            </tr>
                            <tr>
                                <td>Country:</td><td>${country}</td>
                            </tr>
                            <tr>
                                <td>Phone:</td><td>${phone}</td>
                            </tr>
                            <tr>
                                <td>Email:</td><td><a href="mailto:${email}">${email}</a></td>
                            </tr>
                            <tr>
                                <td>Message:</td><td>${message}</td>
                            </tr>
                      </tbody>
                </table>
            `,
        });
        response.status(200);
    } catch (e) {
        response.status(500);
        response.json(e);
    }

    response.json({});

}, {
    enforceLogin: false
}));
