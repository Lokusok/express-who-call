const moment = require('moment');

moment.locale('ru');

const getMonthName = ({ obj }) => {
  const objDate = moment(obj.createdAt);
  let monthName = objDate.format('MMMM');
  monthName = monthName[0].toUpperCase() + monthName.slice(1);

  return monthName;
};

module.exports = getMonthName;
