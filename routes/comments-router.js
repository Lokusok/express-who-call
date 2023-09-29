const Router = require('express');
const router = new Router();

const commentsController = require('../controllers/comments-controller');

router.get('/new', commentsController.makeComment);

module.exports = router;
