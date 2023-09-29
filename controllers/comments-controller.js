class CommentsController {
  async makeComment(req, res) {
    res.end('making new comment');
  }
}

module.exports = new CommentsController();
