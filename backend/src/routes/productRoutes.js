const router = require('express').Router();
const {
  listProducts, getProduct, createProduct, updateProduct, deleteProduct, lowStockProducts,
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Public / any logged-in role (customer app, POS lookup) can read
router.get('/', listProducts);
router.get('/low-stock', authMiddleware, roleMiddleware('admin'), lowStockProducts);
router.get('/:id', getProduct);

// Admin-only writes
router.post('/', authMiddleware, roleMiddleware('admin'), createProduct);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteProduct);

module.exports = router;
