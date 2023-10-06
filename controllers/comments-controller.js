class CommentsController {
  // создание нового комментария
  async makeComment(req, res) {
    res.end('making new comment');
  }
}

module.exports = new CommentsController();
