const { sendMail } = require('../mail/send-mail');
const axios = require('axios');

class MailController {
  // отправка текста
  async sendText(req, res) {
    const { name, email, text, token } = req.body;

    if (![name, email, text, token].every(Boolean)) {
      return res.status(403).json({});
    }

    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          response: token,
          secret: process.env.RECAPTCHA_SECRET_KEY,
        },
      }
    );

    const { success } = response.data;

    if (!success) {
      console.log({ token, success }, 'FAILED');
      return res.status(403).json({});
    }

    sendMail(process.env.EMAIL_ADMIN, { name, email, text });

    return res.json({
      result: true,
      message: 'success send message',
    });
  }
}

module.exports = new MailController();
