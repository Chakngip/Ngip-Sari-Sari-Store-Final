const { Op, fn, col, literal } = require('sequelize');
const { sequelize, Order, OrderItem, Shift, User, Product } = require('../models');

function parseDateRange(query) {
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6); // last 7 days
  const from = query.from ? new Date(query.from) : defaultFrom;
  const to = query.to ? new Date(new Date(query.to).setHours(23, 59, 59, 999)) : now;
  return { from, to };
}

// GET /api/admin/reports/sales?from=&to=&source=  (admin only)
async function salesReport(req, res, next) {
  try {
    const { from, to } = parseDateRange(req.query);
    const { source } = req.query;

    const where = {
      createdAt: { [Op.gte]: from, [Op.lte]: to },
      status: { [Op.notIn]: ['cancelled'] },
    };
    if (source) where.order_source = source;

    const orders = await Order.findAll({ where, include: [{ model: OrderItem, as: 'items' }] });

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    const revenueBySource = orders.reduce((acc, o) => {
      acc[o.order_source] = (acc[o.order_source] || 0) + Number(o.total_amount);
      return acc;
    }, {});

    const revenueByMethod = orders.reduce((acc, o) => {
      acc[o.payment_method] = (acc[o.payment_method] || 0) + Number(o.total_amount);
      return acc;
    }, {});

    // Revenue per day, for a simple line/bar chart
    const revenueByDay = {};
    orders.forEach((o) => {
      const day = o.createdAt.toISOString().slice(0, 10);
      revenueByDay[day] = (revenueByDay[day] || 0) + Number(o.total_amount);
    });
    const dailySeries = Object.entries(revenueByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue }));

    // Top-selling products by quantity within the range
    const productTotals = {};
    orders.forEach((o) => {
      o.items.forEach((it) => {
        if (!productTotals[it.product_name]) {
          productTotals[it.product_name] = { name: it.product_name, quantity: 0, revenue: 0 };
        }
        productTotals[it.product_name].quantity += it.quantity;
        productTotals[it.product_name].revenue += Number(it.line_total);
      });
    });
    const topProducts = Object.values(productTotals)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    res.json({
      range: { from, to },
      totalRevenue,
      totalOrders,
      avgOrderValue,
      revenueBySource,
      revenueByMethod,
      dailySeries,
      topProducts,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/reports/shifts?from=&to=&cashier_id=  (admin only) — shift history across all cashiers
async function shiftsReport(req, res, next) {
  try {
    const { from, to } = parseDateRange(req.query);
    const { cashier_id } = req.query;

    const where = { opened_at: { [Op.gte]: from, [Op.lte]: to } };
    if (cashier_id) where.cashier_id = cashier_id;

    const shifts = await Shift.findAll({
      where,
      include: [{ model: User, as: 'cashier', attributes: ['id', 'name'] }],
      order: [['opened_at', 'DESC']],
    });

    res.json(shifts);
  } catch (err) {
    next(err);
  }
}

module.exports = { salesReport, shiftsReport };
