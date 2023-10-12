const Router = require('express');
const router = new Router();

const mailController = require('../controllers/mail-controller.js');

router.post('/send-text', mailController.sendText);

module.exports = router;
