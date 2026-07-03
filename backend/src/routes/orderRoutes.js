const router = require('express').Router();
const {
  createOrder, listMyOrders, getOrder, getOrderReceipt, cancelOrder,
} = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware); // must be logged in for all order actions

router.post('/', roleMiddleware('customer'), createOrder);
router.get('/', roleMiddleware('customer'), listMyOrders);
router.get('/:id', getOrder); // owner or admin checked inside controller
router.get('/:id/receipt', getOrderReceipt);
router.put('/:id/cancel', roleMiddleware('customer'), cancelOrder);

module.exports = router;
