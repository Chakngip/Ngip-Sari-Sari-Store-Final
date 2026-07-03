const { sequelize, Product, Category, StockMovement, User } = require('../models');
const { applyStockChange } = require('../utils/inventory');

// GET /api/admin/inventory?low_stock=true  (admin only)
async function listInventory(req, res, next) {
  try {
    const { low_stock } = req.query;
    const products = await Product.findAll({
      where: { is_active: true },
      include: [{ model: Category, attributes: ['id', 'name'] }],
      order: [['name', 'ASC']],
    });

    const result = low_stock === 'true'
      ? products.filter((p) => p.stock_qty <= p.low_stock_threshold)
      : products;

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/inventory/:productId/restock  (admin only)
// body: { quantity, note }
async function restock(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { quantity, note } = req.body;
    if (!quantity || quantity <= 0) {
      await t.rollback();
      return res.status(400).json({ message: 'quantity must be a positive number' });
    }

    const product = await Product.findByPk(req.params.productId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    await applyStockChange(product, Number(quantity), {
      type: 'restock', note, userId: req.user.id, transaction: t,
    });

    await t.commit();
    res.json(product);
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// POST /api/admin/inventory/:productId/adjust  (admin only) — correction, can be +/-
// body: { quantity_change, note }
async function adjustStock(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { quantity_change, note } = req.body;
    if (!quantity_change || quantity_change === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'quantity_change must be a non-zero number' });
    }
    if (!note) {
      await t.rollback();
      return res.status(400).json({ message: 'A note is required for manual adjustments' });
    }

    const product = await Product.findByPk(req.params.productId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock_qty + Number(quantity_change) < 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Adjustment would result in negative stock' });
    }

    await applyStockChange(product, Number(quantity_change), {
      type: 'adjustment', note, userId: req.user.id, transaction: t,
    });

    await t.commit();
    res.json(product);
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// GET /api/admin/inventory/movements?product_id=  (admin only)
async function listMovements(req, res, next) {
  try {
    const { product_id } = req.query;
    const where = product_id ? { product_id } : {};

    const movements = await StockMovement.findAll({
      where,
      include: [
        { model: Product, attributes: ['id', 'name'] },
        { model: User, as: 'actor', attributes: ['id', 'name', 'role'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 200,
    });
    res.json(movements);
  } catch (err) {
    next(err);
  }
}

module.exports = { listInventory, restock, adjustStock, listMovements };
