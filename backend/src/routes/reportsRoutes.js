const router = require('express').Router();
const { salesReport, shiftsReport } = require('../controllers/reportsController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/sales', salesReport);
router.get('/shifts', shiftsReport);

module.exports = router;
