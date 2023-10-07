const Router = require('express');
const router = new Router();

const commentsController = require('../controllers/comments-controller');

router.get(
  '/get-comment-for-telnumber',
  commentsController.getUserCommentForTelNumber
);
router.get(
  '/get-all-comments-for-telnumber',
  commentsController.getAllCommentsForTelNumber
);
router.get('/get-new-comments', commentsController.getNewComments);

router.post('/new', commentsController.makeComment);

module.exports = router;
