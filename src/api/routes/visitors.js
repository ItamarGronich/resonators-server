import express from "../express"
import sendEmail from "../../mailing"
import routeHandler from "../routeHandler"
import axios from 'axios';

express.post('/api/contactForm', routeHandler(async (request, response) => {

    const { name = '', country = '', phone = '', email = '', message = '', 'g-recaptcha-response': grecaptcharesponse } = request.body;

    const recaptchaSecretKey = "6LdyBuQZAAAAAPrDOy-hjdQXMW4jzlKon8SCay3F";
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

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
        }

    }
    catch (e) {
        response.status(500);
        response.json(e);
        return;
    }


    if (!(email || phone)) {
        response.status(422);
        response.json({})
        return;
    }

    try {
        await sendEmail({
            to: 'support@PsySession.com',
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
