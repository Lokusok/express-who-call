const Router = require('express');
const router = new Router();

const userRouter = require('./user-router');
const commentsRouter = require('./comments-router');
const telRouter = require('./tel-router');
const mailRouter = require('./mail-router');

router.use('/user', userRouter);
router.use('/comments', commentsRouter);
router.use('/tel', telRouter);
router.use('/mail', mailRouter);

module.exports = router;
