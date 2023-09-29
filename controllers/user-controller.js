class UserController {
  async makeUser(req, res) {
    res.end('hello new user');
  }
}

module.exports = new UserController();
