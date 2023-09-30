const Router = require('express');
const router = new Router();

const userController = require('../controllers/user-controller');

router.post('/register', userController.registerUser);
router.post('/auth', userController.authUser);
router.post('/check-unique', userController.checkUnique);
router.post('/get-by-email', userController.getByEmail);

module.exports = router;
