const jsonwebtoken = require('jsonwebtoken');
const axios = require('axios');
const moment = require('moment');

const { Comment, User, Tel } = require('../models');

class CommentsController {
  // создание нового комментария
  async makeComment(req, res) {
    const { token, username, telId, description, type, rating } = req.body;

    let commentInstance = null;
    try {
      const tokenData = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      const { id: UserId } = tokenData;

      const response = await axios.get(
        `http://localhost:${process.env.PORT}/comments/get-comment-for-telnumber`,
        {
          params: {
            userId: UserId,
            telId,
          },
        }
      );
      const isCommented = response.data;

      if (isCommented) {
        return res.status(403).json({});
      }

      commentInstance = await Comment.create({
        UserId,
        TelId: telId,
        description,
        username,
        rating,
        type,
      });

      console.log({ UserId, description, telId });
    } catch (err) {
      console.log(err.message);
      // не был передан токен (пользователь не авторизован)
      commentInstance = await Comment.create({
        TelId: telId,
        description,
        username,
        rating,
        type,
      });
    }

    res.json(commentInstance);
  }

  // получить комментарий пользователя к определённому номеру
  async getUserCommentForTelNumber(req, res) {
    const { userId, telId } = req.query;

    if (![userId, telId].every(Boolean)) {
      res.status(403).json({});
    }

    const comment = await Comment.findOne({
      where: { UserId: userId, TelId: telId },
    });

    res.json(Boolean(comment));
  }

  // получить все комментарии к номеру
  async getAllCommentsForTelNumber(req, res) {
    const { telId } = req.query;

    if (!telId) {
      res.status(403).json({});
    }

    const allComments = JSON.parse(
      JSON.stringify(await Comment.findAll({ where: { TelId: telId } }))
    );
    allComments.forEach((comment) => {
      const date = new Date(comment.createdAt);

      comment.date = moment(date).format('YYYY.MM.DD');
      comment.time = moment(date).format('hh:mm:ss');
    });

    res.json(allComments);
  }

  // получить новые комментарии
  async getNewComments(req, res) {
    const { limit } = req.query;

    const newComments = JSON.parse(
      JSON.stringify(
        await Comment.findAll({
          include: {
            model: Tel,
            attributes: ['telNumber'],
          },
          order: [['createdAt', 'DESC']],
          limit,
        })
      )
    );

    newComments.forEach(async (comment) => {
      console.log(comment.TelId);
      comment.telCommentsCounts = JSON.parse(
        JSON.stringify(
          await Comment.findAll({
            where: { TelId: comment.TelId },
          })
        )
      ).length;
    });

    return res.json(newComments);
  }
}

module.exports = new CommentsController();
