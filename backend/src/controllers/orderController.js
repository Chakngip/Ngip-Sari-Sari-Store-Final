const { sequelize, Product, Order, OrderItem, Payment, User } = require('../models');
const { generateReceiptNumber, buildReceiptPayload } = require('../utils/receiptGenerator');
const { applyStockChange } = require('../utils/inventory');
const { Op } = require('sequelize');

// POST /api/orders  (customer) — checkout
// body: { items: [{ product_id, quantity }], payment_method, delivery_address }
async function createOrder(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { items, payment_method, delivery_address } = req.body;

    if (!items || !items.length) {
      await t.rollback();
      return res.status(400).json({ message: 'Your cart is empty' });
    }
    if (!delivery_address) {
      await t.rollback();
      return res.status(400).json({ message: 'Delivery address is required' });
    }

    let subtotal = 0;
    const lineItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!product || !product.is_active) {
        await t.rollback();
        return res.status(404).json({ message: `Product not found: ${item.product_id}` });
      }
      if (product.stock_qty < item.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const lineTotal = Number(product.price) * item.quantity;
      subtotal += lineTotal;

      lineItemsData.push({
        product, quantity: item.quantity, price_at_purchase: product.price, line_total: lineTotal,
      });
    }

    const method = payment_method || 'cod';
    const receipt_number = await generateReceiptNumber();

    const order = await Order.create({
      receipt_number,
      user_id: req.user.id,
      order_source: 'online',
      subtotal,
      discount: 0,
      total_amount: subtotal,
      status: 'pending', // awaiting admin confirmation / preparation
      payment_method: method,
      delivery_address,
    }, { transaction: t });

    // Deduct stock and log a movement per line item now that we have the order id
    for (const li of lineItemsData) {
      await applyStockChange(li.product, -li.quantity, {
        type: 'online_order', referenceOrderId: order.id, userId: req.user.id, transaction: t,
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
      provider: method,
      status: method === 'cod' ? 'pending' : 'pending',
    }, { transaction: t });

    await t.commit();

    const receipt = buildReceiptPayload(order, orderItems, null, null);
    res.status(201).json({ order, items: orderItems, receipt });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// GET /api/orders  (customer) — own order history
async function listMyOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/orders
async function listAllOrders(req, res, next) {
  console.log("========== listAllOrders ==========");
  console.log("Query:", req.query);

  try {
    const { status, startDate, endDate, order_source } = req.query;

    const where = {};
    if (status) { where.status = status; }
    console.log("order_source =", order_source);

    if (order_source) {
      console.log("Applying source filter...");
      where.order_source = order_source;
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      where.createdAt = {
        [Op.between]: [start, end],
      };
    }

    console.log("Where:", where);

    const orders = await Order.findAll({
      where,
      include: [
        { model: OrderItem, as: "items" },
        {
          model: User,
          as: "customer",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log("Orders Found:", orders.length);

    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/orders/new-count
async function getNewOrderCount(req, res, next) {
  try {
    const count = await Order.count({
      where: {
        status: 'pending',
      },
    });

    res.json({ count });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id  (owner or admin)
async function getOrder(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
        },
        {
          model: User,
          as: "customer",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: User,
          as: "cashier",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role === 'customer' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not your order' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id/receipt
async function getOrderReceipt(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id, { include: [{ model: OrderItem, as: 'items' }] });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role === 'customer' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not your order' });
    }
    const receipt = buildReceiptPayload(order, order.items, null, null);
    res.json(receipt);
  } catch (err) {
    next(err);
  }
}

// PUT /api/orders/:id/cancel  (customer, only while pending) — restores stock
async function cancelOrder(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.id, { transaction: t });
    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user_id !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ message: 'Not your order' });
    }
    if (order.status !== 'pending') {
      await t.rollback();
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    const items = await OrderItem.findAll({ where: { order_id: order.id }, transaction: t });
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t, lock: t.LOCK.UPDATE });
      if (product) {
        await applyStockChange(product, item.quantity, {
          type: 'online_cancel', referenceOrderId: order.id, userId: req.user.id, transaction: t,
        });
      }
    }

    order.status = 'cancelled';
    await order.save({ transaction: t });
    await t.commit();
    res.json({ message: 'Order cancelled, stock restored' });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// PUT /api/admin/orders/:id/complete
async function completeOrder(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Only POS orders can use this endpoint
    if (order.order_source !== "pos") {
      return res.status(400).json({
        message: "Only POS orders can be completed.",
      });
    }

    // Already completed
    if (order.status === "completed") {
      return res.status(400).json({
        message: "Order is already completed.",
      });
    }

    order.status = "completed";
    await order.save();

    res.json({
      message: "Order completed successfully.",
      order,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, listMyOrders, getOrder, getOrderReceipt, cancelOrder, listAllOrders, getNewOrderCount,completeOrder };
