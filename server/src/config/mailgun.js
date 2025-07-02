const FormData = require("form-data");
const Mailgun = require("mailgun.js");
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;

async function sendEmails(emails, subject, text) {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
        username: "api",
        key: MAILGUN_API_KEY,
    });

    // Send separately in case one bad email
    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        try {
            const data = await mg.messages.create("mg.fightscore.live", {
                from: "FightScore.Live <no-reply@mg.fightscore.live>",
                to: [email],
                subject: subject,
                text: text,
            });
        } catch (error) {
            console.error(error);
        }
    }
}
module.exports = { sendEmails };
