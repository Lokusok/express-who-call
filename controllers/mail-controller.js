const { sendMail } = require('../mail/send-mail');

class MailController {
  // отправка текста
  async sendText(req, res) {
    const { name, email, text } = req.body;

    if (![name, email, text].every(Boolean)) {
      return res.status(403).json({});
    }

    sendMail('dmidrok@gmail.com', { name, email, text });

    return res.json({
      result: true,
      message: 'success send message',
    });
  }
}

module.exports = new MailController();
