const mailgun = require('mailgun-js');
const DOMAIN = 'sandbox26d9194e6d424d04829cd9429e0654b6.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});

function sendEmail(to, subject, text) {
  const data = {
    from: 'Excited User <dmgrabski97@gmail.com>',
    to: to,
    subject: subject,
    text: text
  };

  mg.messages().send(data, function (error, body) {
    console.log(body);
    if (error) {
      console.error("Error sending email:", error);
    }
  });
}

function sendVerificationEmail(email, verificationToken) {
  const verificationUrl = `${process.env.FRONTEND_URL}/users/verify/${verificationToken}`;
  const message = `Please verify your email by clicking on this link: ${verificationUrl}`;

  sendEmail(email, 'Verify Your Email', message);
}

module.exports = { sendEmail, sendVerificationEmail };
