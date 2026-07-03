const router = require('express').Router();
const { listInventory, restock, adjustStock, listMovements } = require('../controllers/inventoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', listInventory);
router.get('/movements', listMovements);
router.post('/:productId/restock', restock);
router.post('/:productId/adjust', adjustStock);

module.exports = router;
