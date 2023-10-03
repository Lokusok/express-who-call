const Router = require('express');
const router = new Router();

const telController = require('../controllers/tel-controller');

router.post('/search', telController.searchTelNumber);
router.post('/isValid', telController.isValid);
router.post('/standartify', telController.standartifyTelNumber);

module.exports = router;
