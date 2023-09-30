const { User } = require('../models');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

class UserController {
  // регистрация нового пользователя
  async registerUser(req, res) {
    let { username, email, password } = req.body;

    if (![username, email, password].every(Boolean)) {
      res.status(403).json({});
    }

    password = await bcrypt.hash(password, 5);
    const newUser = await User.create({ nickname: username, email, password });
    const token = jsonwebtoken.sign(
      { loggedIn: false },
      process.env.SECRET_KEY
    );

    return res.json({
      user: newUser,
      token,
    });
  }

  // проверка пользователя на уникальность по email, username
  async checkUnique(req, res) {
    let { type, value } = req.body;
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

    console.log({ email });

    if (!email) {
      return res.status(403).json({});
    }

    const findedUser = await User.findOne({ where: { email } });

    console.log({ findedUser });

    return res.json(findedUser);
  }

  // авторизация пользователя
  async authUser(req, res) {
    res.end('in process');
  }
}

module.exports = new UserController();
