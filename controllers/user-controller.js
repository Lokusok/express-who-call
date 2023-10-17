const { User } = require('../models');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const generateJWT = require('../utils/generate-jwt');
const hashPassword = require('../utils/hash-password');
const validatePassword = require('../utils/validate-password');

class UserController {
  // регистрация нового пользователя
  async registerUser(req, res) {
    let { username, email, password } = req.body;

    if (![username, email, password].every(Boolean)) {
      return res.status(403).json({});
    }

    if (username.length < 2 || username.length > 10) {
      return res.status(403).status({});
    }

    const isValidPassword = validatePassword(password);

    if (!isValidPassword) {
      return res.status(403).status({});
    }

    password = await hashPassword({ password });
    const newUser = await User.create({ nickname: username, email, password });

    return res.json({
      user: newUser,
    });
  }

  // проверка пользователя на уникальность по email, username
  async checkUnique(req, res) {
    const { type, value } = req.body;
    let result = null;

    switch (type) {
      case 'email': {
        result = await User.findAll({ where: { email: value } });
        break;
      }
      case 'username': {
        result = await User.findAll({ where: { nickname: value } });
        break;
      }
    }

    return res.json(Boolean(!result.length));
  }

  // получение пользователя по почте
  async getByEmail(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(403).json({});
    }

    const findedUser = await User.findOne({ where: { email } });

    return res.json(findedUser);
  }

  // авторизация пользователя
  async authUser(req, res) {
    const { email, password, remember } = req.body;

    if (![email, password].every(Boolean)) {
      return res.status(403).json({});
    }

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'password', 'nickname'],
    });

    if (!user) {
      return res.status(403).json({});
    }

    const isPasswordEqual = await bcrypt.compare(
      password,
      user.getDataValue('password')
    );

    if (!isPasswordEqual) {
      return res.status(403).json({});
    }

    let token = null;

    if (user) {
      token = generateJWT(
        {
          id: user.getDataValue('id'),
          username: user.getDataValue('nickname'),
        },
        '12h'
      );
    }

    const result = {
      result: isPasswordEqual,
      id: user.getDataValue('id'),
      username: user.getDataValue('nickname'),
      rememberUser: remember,
      token,
    };

    res.status(200).json(result);
  }

  // проверка jwt - токена
  async verifyJWT(req, res) {
    const { token } = req.body;

    if (!token) {
      return res.status(403).json({});
    }

    try {
      let result = jsonwebtoken.verify(token, process.env.SECRET_KEY);

      return res.json(result);
    } catch (err) {
      return res.status(403).json({});
    }
  }

  // смена пароля на новый
  async changePassword(req, res) {
    const { newPassword, token } = req.body;

    if (![newPassword, token].every(Boolean)) {
      return res.status(403).json({});
    }

    const isValidPassword = validatePassword(newPassword);

    if (!isValidPassword) {
      return res.status(403).json({});
    }

    const user = await User.findOne({ where: { token } });

    if (!user) {
      return res.status(403).json({});
    }

    user.password = await hashPassword({ password: newPassword });
    user.token = null;
    await user.save();

    return res.send({
      status: 'Пароль был изменён',
      result: true,
    });
  }

  // проверка на существование по токену
  async checkExistByToken(req, res) {
    const { token } = req.body;

    if (!token) {
      return res.status(403).json({});
    }

    const user = await User.findOne({ where: { token } });

    return res.json({
      status: Boolean(user),
    });
  }

  // проверка на существование по никнейму
  async isExist(req, res) {
    const { username } = req.query;

    if (!username) {
      return res.status(403).json({});
    }

    const user = await User.findOne({ where: { nickname: username } });

    console.log({ user });

    return res.json(Boolean(user));
  }
}

module.exports = new UserController();
