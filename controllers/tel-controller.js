const axios = require('axios');
const { QueryTypes } = require('sequelize');

const { Tel, Comment } = require('../models');
const sequelize = require('../db');

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
      return res.status(409).json({});
    }

    const searchedTel = await Tel.findOne({ where: { telNumber: search } });

    if (!searchedTel) {
      // добавить добавление несуществующего в бд, но с предварительной валидацией.
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

  // получить дополнительную информацию
  async getAdditionalInfo(req, res) {
    const { telNumber } = req.query;

    if (!telNumber) {
      res.status(403).json({});
    }

    const info = await axios.get('https://num.voxlink.ru/get/', {
      params: {
        num: telNumber,
      },
    });

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
}

module.exports = new TelController();
