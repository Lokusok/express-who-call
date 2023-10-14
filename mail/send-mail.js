const createTransport = require('./utils/createTransport');
const createMailOptions = require('./utils/createMailOptions');

function sendMail(recipient, { subject, html }) {
  const transport = createTransport();

  const mailOptions = createMailOptions({
    from: `Node js <${process.env.EMAIL_USER}>`,
    to: recipient,
    subject,
    html,
  });

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
