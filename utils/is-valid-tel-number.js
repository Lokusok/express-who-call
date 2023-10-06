const parsePhoneNumber = require('libphonenumber-js');

const isValidTelNumber = (telNumber) => {
  const phoneNumber = parsePhoneNumber(telNumber, 'RU');
  const isValidNumber = phoneNumber?.isValid();

  return isValidNumber;
};

module.exports = isValidTelNumber;
