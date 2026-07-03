const router = require('express').Router();
const { createSale, listMySales, getReceipt, voidSale } = require('../controllers/posController');
const { openShift, closeShift, shiftSummary, listMyShifts } = require('../controllers/shiftController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware, roleMiddleware('cashier', 'admin')); // cashier-only (admin can view too)

// Shift management
router.post('/shift/open', openShift);
router.post('/shift/close', closeShift);
router.get('/shift/summary', shiftSummary);
router.get('/shift/history', listMyShifts);

// Sales
router.post('/sales', createSale);
router.get('/sales', listMySales);
router.get('/sales/:id/receipt', getReceipt);
router.put('/sales/:id/void', voidSale);

module.exports = router;
