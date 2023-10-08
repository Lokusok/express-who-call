const jsonwebtoken = require('jsonwebtoken');
const axios = require('axios');
const moment = require('moment');

const { Comment, Tel } = require('../models');

class CommentsController {
  // создание нового комментария
  async makeComment(req, res) {
    const { token, username, telId, description, type, rating } = req.body;

    let commentInstance = null;
    try {
      const tokenData = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      const { id: UserId } = tokenData;

      const response = await axios.get(
        `${process.env.HOST}/comments/get-comment-for-telnumber`,
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
    } catch (err) {
      // не был передан токен (пользователь не авторизован)
      commentInstance = await Comment.create({
        TelId: telId,
        description,
        username,
        rating,
        type,
      });
    }

    const response = await axios.get(`${process.env.HOST}/tel/get-avg-rating`, {
      params: {
        telId,
      },
    });
    const avgRating = Number(response.data.avgRating).toFixed(1);
    await Tel.update({ rating: avgRating }, { where: { id: telId } });

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
      JSON.stringify(
        await Comment.findAll({
          where: { TelId: telId },
          order: [['createdAt', 'DESC']],
        })
      )
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
    const { limit = 10 } = req.query;

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

    for (const comment of newComments) {
      comment.telCommentsCount = JSON.parse(
        JSON.stringify(
          await Comment.findAll({
            where: { TelId: comment.TelId },
          })
        )
      ).length;
    }

    return res.json(newComments);
  }
}

module.exports = new CommentsController();
