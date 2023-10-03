const { Tel } = require('../models');

const isValidTelNumber = require('../utils/is-valid-tel-number');
const standartifyTelNumber = require('../utils/standartify-tel-number');
const minifyTelNumber = require('../utils/minify-tel-number');

class TelController {
  // поиск телефона
  async searchTelNumber(req, res) {
    let { search } = req.body;

    if (!search) {
      return res.status(404).json({});
    }

    const { internationalFormat } = standartifyTelNumber(search);
    search = minifyTelNumber(internationalFormat);

    if (!isValidTelNumber(search)) {
      console.log('не валиден');
      return res.status(409).json({});
    }

    const searchedTel = await Tel.findOne({ where: { telNumber: search } });

    if (!searchedTel) {
      return res.status(404).json({});
    }

    return res.json(searchedTel);
  }

  // стандартизация телефона
  async standartifyTelNumber(req, res) {
    const { telNumber } = req.body;

    if (!telNumber) {
      return res.status(404).json({});
    }

    const result = standartifyTelNumber(telNumber);

    return res.json(result);
  }

  // проверка на валидность
  async isValid(req, res) {
    const { telNumber } = req.body;

    if (!telNumber) {
      return res.status(404).json({});
    }

    return res.json(isValidTelNumber(telNumber));
  }
}

module.exports = new TelController();
