const parsePhoneNumber = require('libphonenumber-js');

const standartifyTelNumber = (telNumber) => {
  const phoneNumber = parsePhoneNumber(telNumber, 'RU');

  const internationalFormat = phoneNumber?.formatInternational();
  const nationalFormat = phoneNumber?.formatNational();

  return {
    internationalFormat,
    nationalFormat,
  };
};

module.exports = standartifyTelNumber;
