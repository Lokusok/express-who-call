const { User } = require('../models');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const generateJWT = require('../utils/generate-jwt');

class UserController {
  // регистрация нового пользователя
  async registerUser(req, res) {
    let { username, email, password } = req.body;

    if (![username, email, password].every(Boolean)) {
      return res.status(403).json({});
    }

    password = await bcrypt.hash(password, 5);
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
    const { email, password } = req.body;

    if (![email, password].every(Boolean)) {
      return res.status(403).json({});
    }

    const user = await User.findOne({
      where: { email },
      attributes: ['password', 'nickname'],
    });

    console.log({ user, email });
    if (!user) {
      return res.status(403).json({});
    }

    const isPasswordEqual = await bcrypt.compare(
      password,
      user.getDataValue('password')
    );
    let token = null;

    if (user) {
      token = generateJWT({ username: user.getDataValue('nickname') }, '12h');
    }

    const result = {
      result: isPasswordEqual,
      username: isPasswordEqual ? user.getDataValue('nickname') : null,
      token,
    };

    res.status(200).json(result);
  }

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
}

module.exports = new UserController();
