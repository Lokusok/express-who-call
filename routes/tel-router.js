const Router = require('express');
const router = new Router();

const telController = require('../controllers/tel-controller');

router.get('/create', telController.makeTel);

module.exports = router;
