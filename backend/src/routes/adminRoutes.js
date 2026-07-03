const router = require('express').Router();
const {
  createCashier, listCashiers, setCashierStatus, cashierShiftHistory, dashboardStats,
  listOrders, updateOrderStatus,
} = require('../controllers/adminController');
const { listUsers, getUser, setUserStatus } = require('../controllers/usersController');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware, roleMiddleware('admin')); // everything below is admin-only

router.get('/dashboard/stats', dashboardStats);

router.post('/cashiers', createCashier);
router.get('/cashiers', listCashiers);
router.put('/cashiers/:id/status', setCashierStatus);
router.get('/cashiers/:id/shifts', cashierShiftHistory);

router.get('/orders', listOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/status', setUserStatus);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
