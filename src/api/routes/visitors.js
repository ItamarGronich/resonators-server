import express from "../express"
import routeHandler from "../routeHandler"
import sendEmail from "../../emailScheduler/sendResonatorEmail"

express.post('/api/contactForm', routeHandler(async (request, response) => {

    const { name = '', country = '', phone = '', email = '', message = '' } = request.body;

    if (!(email || phone)) {
        response.status(422);
        response.json({})
        return;
    }

    try {
        await sendEmail({
            to: 'BuizDev@PsySession.com',
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
        response.status(500)
    }

    response.json({});

}, {
    enforceLogin: false
}));
