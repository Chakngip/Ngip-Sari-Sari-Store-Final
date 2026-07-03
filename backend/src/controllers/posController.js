const { sequelize, Product, Order, OrderItem, Payment, Shift } = require('../models');
const { generateReceiptNumber, buildReceiptPayload } = require('../utils/receiptGenerator');
const { applyStockChange } = require('../utils/inventory');

// POST /api/pos/sales  (cashier) — create a walk-in sale
// body: { items: [{ product_id, quantity }], payment_method, amount_tendered, discount }
async function createSale(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { items, payment_method, amount_tendered, discount } = req.body;

    if (!items || !items.length) {
      await t.rollback();
      return res.status(400).json({ message: 'At least one item is required' });
    }

    const openShift = await Shift.findOne({
      where: { cashier_id: req.user.id, status: 'open' },
      transaction: t,
    });
    if (!openShift) {
      await t.rollback();
      return res.status(400).json({ message: 'You must open a shift before making sales' });
    }

    // Lock and validate stock for each product (don't mutate yet — need order.id for the movement log)
    let subtotal = 0;
    const lineItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!product || !product.is_active) {
        await t.rollback();
        return res.status(404).json({ message: `Product not found: ${item.product_id}` });
      }

      if (product.stock_qty < item.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const price = Number(product.price);
      const qty = Number(item.quantity);
      const lineTotal = price * qty;

      subtotal += lineTotal;

      // ✅ IMPORTANT: store data for later steps
      lineItemsData.push({
        product,
        quantity: qty,
        price_at_purchase: price,
        line_total: lineTotal,
      });
    }
    const discountAmt = discount || 0;
    const total = subtotal - discountAmt;
    const tendered = amount_tendered != null ? Number(amount_tendered) : null;
    const change = payment_method === 'cash' && tendered != null ? tendered - total : null;

    const receipt_number = await generateReceiptNumber();

    const order = await Order.create({
      receipt_number,
      cashier_id: req.user.id,
      shift_id: openShift.id,
      order_source: 'pos',
      subtotal,
      discount: discountAmt,
      total_amount: total,
      status: 'paid',
      payment_method,
      amount_tendered: tendered,
      change_due: change,
    }, { transaction: t });

    // Now deduct stock and log a movement per line item, referencing this order
    for (const li of lineItemsData) {
      await applyStockChange(li.product, -li.quantity, {
        type: 'sale', referenceOrderId: order.id, userId: req.user.id, transaction: t,
      });
    }

    const orderItems = await Promise.all(lineItemsData.map((li) => OrderItem.create({
      order_id: order.id,
      product_id: li.product.id,
      product_name: li.product.name,
      quantity: li.quantity,
      price_at_purchase: li.price_at_purchase,
      line_total: li.line_total,
    }, { transaction: t })));

    await Payment.create({
      order_id: order.id,
      provider: payment_method,
      status: 'paid',
      paid_at: new Date(),
    }, { transaction: t });

    await t.commit();

    const receipt = buildReceiptPayload(order, orderItems, req.user.name, openShift.id);
    res.status(201).json({ order, items: orderItems, receipt });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// GET /api/pos/sales  (cashier) — current shift's sales
async function listMySales(req, res, next) {
  try {
    const openShift = await Shift.findOne({ where: { cashier_id: req.user.id, status: 'open' } });
    if (!openShift) return res.json([]);

    const orders = await Order.findAll({
      where: { shift_id: openShift.id },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// GET /api/pos/sales/:id/receipt  — regenerate a receipt (print/reprint)
async function getReceipt(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }, { model: require('../models').User, as: 'cashier' }],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const receipt = buildReceiptPayload(order, order.items, order.cashier ? order.cashier.name : null, order.shift_id);
    res.json(receipt);
  } catch (err) {
    next(err);
  }
}

// PUT /api/pos/sales/:id/void  (cashier, may require admin PIN in a later phase)
async function voidSale(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.cashier_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed to void this sale' });
    }

    const t = await sequelize.transaction();
    try {
      const items = await OrderItem.findAll({ where: { order_id: order.id }, transaction: t });
      for (const item of items) {
        const product = await Product.findByPk(item.product_id, { transaction: t, lock: t.LOCK.UPDATE });
        if (product) {
          await applyStockChange(product, item.quantity, {
            type: 'void', referenceOrderId: order.id, userId: req.user.id, transaction: t,
          });
        }
      }
      order.status = 'cancelled';
      await order.save({ transaction: t });
      await t.commit();
      res.json({ message: 'Sale voided, stock restored' });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { createSale, listMySales, getReceipt, voidSale };
