const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Order, OrderItem, Shift, Product } = require('../models');

// POST /api/admin/cashiers  (admin only) — create a cashier account
async function createCashier(req, res, next) {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ message: 'name, password, and email or phone are required' });
    }

    const existing = await User.findOne({ where: email ? { email } : { phone } });
    if (existing) return res.status(409).json({ message: 'Account already exists' });

    const password_hash = await bcrypt.hash(password, 10);
    const cashier = await User.create({ name, email, phone, password_hash, role: 'cashier' });

    res.status(201).json({
      id: cashier.id, name: cashier.name, email: cashier.email, phone: cashier.phone, role: cashier.role,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/cashiers  (admin only)
async function listCashiers(req, res, next) {
  try {
    const cashiers = await User.findAll({
      where: { role: 'cashier' },
      attributes: ['id', 'name', 'email', 'phone', 'is_active', 'createdAt'],
    });
    res.json(cashiers);
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/cashiers/:id/status  (admin only) — activate/deactivate
async function setCashierStatus(req, res, next) {
  try {
    const { is_active } = req.body;
    const cashier = await User.findOne({ where: { id: req.params.id, role: 'cashier' } });
    if (!cashier) return res.status(404).json({ message: 'Cashier not found' });
    cashier.is_active = !!is_active;
    await cashier.save();
    res.json({ message: 'Cashier status updated', is_active: cashier.is_active });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/cashiers/:id/shifts  (admin only) — shift history for one cashier
async function cashierShiftHistory(req, res, next) {
  try {
    const shifts = await Shift.findAll({
      where: { cashier_id: req.params.id },
      order: [['opened_at', 'DESC']],
    });
    res.json(shifts);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/dashboard/stats  (admin only)
async function dashboardStats(req, res, next) {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const [
      totalProducts,
      totalCustomers,
      totalCashiers,
      ordersToday,
      allOrders,
    ] = await Promise.all([
      Product.count({ where: { is_active: true } }),
      User.count({ where: { role: "customer" } }),
      User.count({ where: { role: "cashier" } }),
      Order.count({
        where: {
          createdAt: { [Op.gte]: startOfDay },
        },
      }),
      Order.findAll({
        where: {
          status: {
            [Op.notIn]: ["cancelled"],
          },
        },
      }),
    ]);

    const salesToday =
      (await Order.sum("total_amount", {
        where: {
          createdAt: { [Op.gte]: startOfDay },
          status: {
            [Op.notIn]: ["cancelled"],
          },
        },
      })) || 0;

    const onlineSales = allOrders
      .filter((o) => o.order_source === "online")
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const posSales = allOrders
      .filter((o) => o.order_source === "pos")
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    // NEW
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["name"],
        },
        {
          model: User,
          as: "cashier",
          attributes: ["name"],
        },
      ],
    });

    const lowStockProducts = await Product.findAll({
      where: {
        stock_qty: {
          [Op.lte]: 10,
        },
      },
      order: [["stock_qty", "ASC"]],
      limit: 5,
    });

    const pendingOrders = await Order.count({
      where: {
        status: "pending",
      },
    });

    res.json({
      totalProducts,
      totalCustomers,
      totalCashiers,
      ordersToday,
      salesToday,
      lifetimeOnlineSales: onlineSales,
      lifetimePosSales: posSales,

      pendingOrders,
      recentOrders,
      lowStockProducts,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/orders?status=&source=  (admin only) — all orders, online + POS
async function listOrders(req, res, next) {
  try {
    const { status, order_source, startDate, endDate, search } = req.query;

    const where = {};

    // Status Filter
    if (status) {
      where.status = status;
    }

    // Source Filter
    if (order_source) {
      where.order_source = order_source;
    }

    // Date Filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      where.createdAt = {
        [Op.between]: [start, end],
      };
    }

    console.log("Query:", req.query);
    console.log("Where:", where);

    const orders = await Order.findAll({
      where: {
        ...where,

        ...(search
          ? {
              [Op.or]: [
                {
                  receipt_number: {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  "$customer.name$": {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  "$cashier.name$": {
                    [Op.like]: `%${search}%`,
                  },
                },
              ],
            }
          : {}),
      },

      include: [
        {
          model: OrderItem,
          as: "items",
        },
        {
          model: User,
          as: "customer",
          attributes: ["id", "name", "email"],
          required: false,
        },
        {
          model: User,
          as: "cashier",
          attributes: ["id", "name"],
          required: false,
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

// PUT /api/admin/orders/:id/status  (admin only) — update order fulfillment status
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const valid = ['pending', 'paid', 'preparing', 'out_for_delivery', 'completed', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${valid.join(', ')}` });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled orders can no longer be modified.",
      });
    }

    if (order.status === "completed") {
      return res.status(400).json({
        message: "Completed orders can no longer be modified.",
      });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function getOrderSummary(req, res, next) {
  try {
    const orders = await Order.findAll({
      attributes: ["status", "order_source"],
    });

    const summary = {
      pending: 0,
      preparing: 0,
      out_for_delivery: 0,
      completed: 0,
      cancelled: 0,
      pos: 0,
      online: 0,
    };

    orders.forEach((order) => {
      if (summary.hasOwnProperty(order.status)) {
        summary[order.status]++;
      }

      if (order.order_source === "pos") {
        summary.pos++;
      }

      if (order.order_source === "online") {
        summary.online++;
      }
    });

    res.json(summary);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCashier, listCashiers, setCashierStatus, cashierShiftHistory, dashboardStats,
  listOrders, updateOrderStatus, getOrderSummary,
};
