const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(recipient, summary) {

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: recipient,
    subject: "Sales Insight Summary",
    text: summary
  });

}

module.exports = sendEmail;