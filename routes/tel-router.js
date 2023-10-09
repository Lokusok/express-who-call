const Router = require('express');
const router = new Router();

const telController = require('../controllers/tel-controller');

router.get('/info', telController.getAdditionalInfo);
router.get('/get-last-verified', telController.getLastVerifiedTels);
router.get('/get-most-viewed', telController.getMostViewed);
router.get('/get-most-commented', telController.getMostCommented);
router.get('/get-avg-rating', telController.getAvgRating);

router.post('/search', telController.searchTelNumber);
router.post('/is-valid', telController.isValid);
router.post('/standartify', telController.standartifyTelNumber);
router.post('/increment-views-count', telController.incrementViewsCount);
router.post('/minify-tel-number', telController.minifyTelNumber);

module.exports = router;
