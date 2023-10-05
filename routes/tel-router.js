const Router = require('express');
const router = new Router();

const telController = require('../controllers/tel-controller');

router.get('/info', telController.getAdditionalInfo);
router.get('/get-last-verified', telController.getLastVerifiedTels);
router.get('/get-most-viewed', telController.getMostViewed);
router.get('/get-most-commented', telController.getMostCommented);

router.post('/search', telController.searchTelNumber);
router.post('/isValid', telController.isValid);
router.post('/standartify', telController.standartifyTelNumber);

module.exports = router;
