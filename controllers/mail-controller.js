const { sendMail } = require('../mail/send-mail');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const { User } = require('../models');

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

    sendMail(process.env.EMAIL_ADMIN, {
      subject: 'Вопрос с сайта who-call',
      html: `
    <div style="font-family: Arial, sans-serif;">
      <u>Вопрос с сайта <b>who-call</b></u>

      <ul>
        <li>Имя пользователя: <b>${name}</b></li>
        <li>Email пользователя: <b>${email}</b></li>
        <li>Вопрос: <b>${text}</b></li>
      </ul>
    </div>
  `,
    });

    return res.json({
      result: true,
      message: 'success send message',
    });
  }

  // отправка ссылки сброса пароля
  async sendResetPasswordLink(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(403).json({});
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(403).json({
        status: 'Пользователь не найден',
        type: 'USER_UNDEFINED',
      });
    }

    // if (user.token) {
    //   return res.status(403).json({
    //     status: 'Письмо уже отправлено',
    //     type: 'ALREADY_SENT',
    //   });
    // }

    user.token = uuidv4();
    await user.save();

    const resetLink = `${process.env.CLIENT_HOST}/forget_password/reset/${user.token}`;

    sendMail(email, {
      subject: 'Сброс пароля на сайте who-call',
      html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Для сброса пароля на сайте who-call — перейдите по ссылке:</h2>
        <a href="${resetLink}">${resetLink}</a>
      </div>
      `,
    });

    return res.end('Отправили ссылку на сброс пользователю ' + email);
  }
}

module.exports = new MailController();
