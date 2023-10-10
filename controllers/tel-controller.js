const { fn, col } = require('sequelize');
const axios = require('axios');
const { QueryTypes } = require('sequelize');
const moment = require('moment');

const { Tel, Comment } = require('../models');
const sequelize = require('../db');

const isValidTelNumber = require('../utils/is-valid-tel-number');
const standartifyTelNumber = require('../utils/standartify-tel-number');
const minifyTelNumber = require('../utils/minify-tel-number');
const getMonthName = require('../utils/get-month-name');
const months = require('../utils/vars/months');

class TelController {
  // поиск телефона
  async searchTelNumber(req, res) {
    let { telNumber, telId } = req.body;

    if (!telNumber && !telId) {
      return res.status(404).json({});
    }

    let internationalFormat = null;

    if (telNumber) {
      internationalFormat = standartifyTelNumber(telNumber).internationalFormat;
      telNumber = minifyTelNumber(internationalFormat);

      if (!isValidTelNumber(telNumber)) {
        return res.status(403).json({});
      }
    }

    let searchedTel = null;

    if (telNumber) {
      searchedTel = await Tel.findOne({ where: { telNumber } });
    } else if (telId) {
      searchedTel = await Tel.findOne({ where: { id: telId } });
    }

    if (!searchedTel && telNumber) {
      searchedTel = await Tel.create({ telNumber });
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

  // минификация номера телефона
  async minifyTelNumber(req, res) {
    const { telNumber } = req.body;

    if (!telNumber) {
      return res.status(403).json({});
    }

    const responseValid = await axios.post(`${process.env.HOST}/tel/is-valid`, {
      telNumber,
    });
    const isValid = responseValid.data;

    if (!isValid) {
      return res.status(403).json({ message: 'Номер не валиден' });
    }

    const responseFormats = await axios.post(
      `${process.env.HOST}/tel/standartify`,
      {
        telNumber,
      }
    );
    const { internationalFormat } = responseFormats.data;

    const minifiedTelNumber = minifyTelNumber(internationalFormat);

    return res.json({
      minifiedTelNumber,
      isValid,
    });
  }

  // проверка на валидность
  async isValid(req, res) {
    const { telNumber } = req.body;

    if (!telNumber) {
      return res.status(404).json({});
    }

    return res.json(isValidTelNumber(telNumber));
  }

  // получить дополнительную информацию
  async getAdditionalInfo(req, res) {
    const { telNumber } = req.query;

    if (!telNumber) {
      res.status(403).json({});
    }

    let info = null;

    try {
      info = await axios.get('https://num.voxlink.ru/get/', {
        params: {
          num: telNumber,
        },
      });
    } catch (err) {
      info = await axios.get('https://num.voxlink.ru/get/', {
        params: {
          num: telNumber,
        },
      });
    }

    return res.json(info.data);
  }

  // получить последние проверенные телефоны
  async getLastVerifiedTels(req, res) {
    const { limit = 10 } = req.query;
    const lastsTels = await sequelize.query(
      `SELECT public."Tels".*,
      (SELECT COUNT(*)
      FROM public."Comments"
      WHERE public."Comments"."TelId" = public."Tels"."id") AS "commentsCount"
      FROM public."Tels"
      ORDER BY "createdAt" DESC
      LIMIT ${limit};`,
      { type: QueryTypes.SELECT }
    );

    return res.json(lastsTels);
  }

  // получить самые просматриваемые посты
  async getMostViewed(req, res) {
    const { limit = 10 } = req.query;
    const mostViewed = await sequelize.query(
      `SELECT public."Tels".*,
      (SELECT COUNT(*)
      FROM public."Comments"
      WHERE public."Comments"."TelId" = public."Tels"."id") AS "commentsCount"
      FROM public."Tels"
      ORDER BY "viewsCount" DESC
      LIMIT ${limit};`,
      { type: QueryTypes.SELECT }
    );

    res.json(mostViewed);
  }

  // получить самые комментируемые посты
  async getMostCommented(req, res) {
    const { limit = 10 } = req.query;
    const mostCommented = await sequelize.query(
      `SELECT public."Tels".*,
      (SELECT COUNT(*)
      FROM public."Comments"
      WHERE public."Comments"."TelId" = public."Tels"."id") AS "commentsCount"
      FROM public."Tels"
      ORDER BY "commentsCount" DESC
      LIMIT ${limit};`,
      { type: QueryTypes.SELECT }
    );

    return res.json(mostCommented);
  }

  // увеличить количество просмотров
  async incrementViewsCount(req, res) {
    const { telId } = req.body;

    if (!telId) {
      res.status(403).json({});
    }

    const telNumber = await Tel.findOne({ where: { id: telId } });
    await telNumber.increment('viewsCount');

    return res.json(telNumber);
  }

  // получить средний рейтинг номера
  async getAvgRating(req, res) {
    const { telId } = req.query;
    const avgRating = await Comment.findOne({
      attributes: [[fn('AVG', col('rating')), 'avgRating']],
      where: { TelId: telId },
    });

    return res.json(avgRating);
  }

  // получить активность по месяцам
  async getActivity(req, res) {
    const { telId } = req.query;

    if (!telId) {
      return res.status(403).json({});
    }

    const responseTelNumber = await axios.post(
      `${process.env.HOST}/tel/search`,
      {
        telId,
      }
    );
    const telNumberObj = responseTelNumber.data;
    const comments = await Comment.findAll({
      where: {
        TelId: telNumberObj.id,
      },
      include: {
        model: Tel,
      },
    });

    const activityArr = [];

    for (let monthName of months) {
      let countMonthComms = 0;

      comments.forEach((comment) => {
        const monthNameObj = getMonthName({ obj: comment });

        if (monthName === monthNameObj) {
          countMonthComms++;
        }
      });

      activityArr.push({
        name: monthName,
        count: countMonthComms,
      });
    }

    return res.json(activityArr);
  }
}

module.exports = new TelController();
