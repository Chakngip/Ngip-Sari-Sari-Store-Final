const router = require('express').Router();
const {
  createOrder, listMyOrders, getOrder, getOrderReceipt, cancelOrder,listAllOrders,getNewOrderCount,completeOrder
} = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.get("/admin/orders", roleMiddleware("admin"), listAllOrders);
router.get("/admin/orders/new-count",roleMiddleware("admin"),getNewOrderCount);
router.put("/admin/orders/:id/complete",roleMiddleware("admin"),completeOrder);
router.post("/", roleMiddleware("customer"), createOrder);
router.get("/", roleMiddleware("customer"), listMyOrders);
router.get("/:id", getOrder);
router.get("/:id/receipt", getOrderReceipt);
router.put("/:id/cancel", roleMiddleware("customer"), cancelOrder);

module.exports = router;
