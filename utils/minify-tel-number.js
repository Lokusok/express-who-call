const minifyTelNumber = (telNumberInternational) => {
  return telNumberInternational.slice(3).split(' ').join('');
};

module.exports = minifyTelNumber;
