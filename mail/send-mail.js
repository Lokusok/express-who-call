const nodemailer = require('nodemailer');
const { OAuth2_client } = require('./mail.config');

function sendMail(recipient, { name, email, text }) {
  const accessToken = OAuth2_client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: `Node js <${process.env.EMAIL_USER}>`,
    to: recipient,
    subject: 'Message from nodeJS',
    html: `
      <u>Вопрос с сайта <b>who-call</b></u>

      <ul>
        <li>Имя пользователя: <b>${name}</b></li>
        <li>Email пользователя: <b>${email}</b></li>
        <li>Вопрос: <b>${text}</b></li>
      </ul>
    `,
  };

  transport.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('SUCCESS');
    transport.close();
  });
}

module.exports = {
  sendMail,
};
