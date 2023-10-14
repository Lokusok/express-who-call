const createMailOptions = ({ from, to, subject, html }) => {
  return {
    from,
    to,
    subject,
    html,
  };
};

module.exports = createMailOptions;
