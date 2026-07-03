const { StockMovement } = require('../models');

/**
 * Adjusts a product's stock_qty and records the movement.
 * `product` must already be locked/fetched within the caller's transaction.
 * `quantityChange` is signed: negative for stock going out, positive for stock coming in.
 */
async function applyStockChange(product, quantityChange, { type, note, referenceOrderId, userId, transaction }) {
  product.stock_qty += quantityChange;
  await product.save({ transaction });

  await StockMovement.create({
    product_id: product.id,
    quantity_change: quantityChange,
    resulting_stock: product.stock_qty,
    type,
    note: note || null,
    reference_order_id: referenceOrderId || null,
    created_by: userId || null,
  }, { transaction });

  return product;
}

module.exports = { applyStockChange };
