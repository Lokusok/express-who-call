const Router = require('express');
const router = new Router();

const userController = require('../controllers/user-controller');

router.get('/is-exist', userController.isExist);

router.post('/register', userController.registerUser);
router.post('/auth', userController.authUser);
router.post('/check-unique', userController.checkUnique);
router.post('/get-by-email', userController.getByEmail);
router.post('/verify-jwt', userController.verifyJWT);
router.post('/change-password', userController.changePassword);
router.post('/check-exist-by-token', userController.checkExistByToken);

module.exports = router;
