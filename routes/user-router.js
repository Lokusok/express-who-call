const Router = require('express');
const router = new Router();

const userController = require('../controllers/user-controller');

router.get('/auth', userController.makeUser);

module.exports = router;
